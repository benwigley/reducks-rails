import humps from 'humps'
import logger from '../libs/logger'
import initApi from '../libs/api'
import actionTypeModifiers from '../libs/actionTypeModifiers'

export const parseResult = (json, inConfig, action={}) => {
  let dataParser = inConfig.parse
  let setMetaData = inConfig.setMetaData
  let data
  let metaData = {}

  // Parse functions from actions override config
  action.api = action.api || {}
  if (typeof action.api.parse === 'function') {
    dataParser = action.api.parse
  }
  if (typeof action.api.setMetaData === 'function') {
    setMetaData = action.api.setMetaData
  }

  // parse and metaData methods are currently not
  // per-collection, but this would be nice in the future.
  switch(typeof dataParser) {
    case 'object': {
      const parseMethod = dataParser && dataParser[resourceType]
      if (!parseMethod) {
        data = json
        break
      }
      data = parseMethod(json)
      break
    }
    case 'function': {
      data = dataParser(json)
      break
    }
    default: {
      data = json
      break
    }
  }

  switch(typeof setMetaData) {
    case 'object': {
      const setMetaData = setMetaData && setMetaData[resourceType]
      if (!setMetaData) { break }

      metaData = setMetaData(json)
      break
    }
    case 'function': {
      metaData = setMetaData(json)
      break
    }
    default: {
      metaData = {}
      break
    }
  }

  return { data, metaData }
}


export const initReduxApiMiddleware = (inConfig) => {

  logger.shouldLog = inConfig.debug

  // Init the api here so that it doesn't
  // get recreated on every new dispatch
  const api = initApi(inConfig)

  const reduxApiMiddleware = (store) => (next) => (action) => {

    // Here we check whether an "api" or "nodeApi" key:object
    // has been given as a parameter in the dispatch({ ...action })
    // call, then skip this "reduxApi" middleware if not.
    if (!action.api) {
      return next(action)
    }

    // Here we check for a valid api object (url is required).
    if (typeof action.api !== 'object') {
      throw new Error(`ReducksRails: Expected action.api to be type 'object', but got type '${typeof action.api}'`)
    } else if (typeof action.api.url !== 'string') {
      throw new Error(`ReducksRails: Expected action.api.url to be type 'string', but got type '${typeof action.api.url}'`)
    }

    // Inform the reducer that the request has been started
    next({
      ...action,
      type: actionTypeModifiers.requestTypeModifier(action.type)
    })

    const requestParams = {
      url: action.api.url,
      method: action.api.method,
      data: humps.decamelizeKeys(action.api.data),
      params: humps.decamelizeKeys(action.api.params)
    }

    // Allow the baseUrl to be changed for specific requests
    if (action.baseUrl) { requestParams.baseURL = action.baseUrl }

    return api.request(requestParams)
      .then((res) => {
        // Inform the reducer that the request was successful
        const parsedData = parseResult(res.data, inConfig, action)
        next({
          ...action,
          type: actionTypeModifiers.successTypeModifier(action.type),
          payload: parsedData,
        })
        return parsedData
      })
      .catch((e) => {
        // Axios can throw actual errors and hide them if we're not careful
        if (e instanceof TypeError) { throw e }
        logger.debug(`libs/reduxApi:failed:${action.api.url}`, e)

        const data = ((e || {}).response || {}).data
        const responseError = data || { errors: [e.toString()] }

        if (typeof inConfig.onResponseError === 'function') {
          inConfig.onResponseError(responseError, { store, config, action })
        }

        // Inform the reducer that the request failed
        next({
          ...action,
          type: actionTypeModifiers.failureTypeModifier(action.type),
          payload: responseError,
        })
        return responseError
      })
  }
  return reduxApiMiddleware
}

export default initReduxApiMiddleware
