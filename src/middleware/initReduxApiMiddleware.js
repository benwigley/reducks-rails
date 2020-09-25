import humps from 'humps'
import logger from '../libs/logger'
import initApi from '../libs/api'
import requestTypeModifer from '../libs/requestTypeModifer'

const initReduxApiMiddleware = (apiConfig) => {

  logger.shouldLog = apiConfig.debug

  // Init the api here so that it doesn't
  // get recreated on every new dispatch
  const api = initApi(apiConfig)

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
    } else if (typeof action.api !== 'string') {
      throw new Error(`ReducksRails: Expected action.api.url to be type 'string', but got type '${typeof action.api.url}'`)
    }

    // Inform the reducer that the request has been started
    next({
      ...action,
      type: requestTypeModifer.requestState(action.type)
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
        next({
          ...action,
          type: requestTypeModifer.successState(action.type),
          payload: res.data,
        })
        return { res: res.data }
      })
      .catch((e) => {
        logger.debug(`libs/reduxApi:failed:${action.api.url}`, e)
        const data = ((e || {}).response || {}).data
        const responseData = data || { errors: [e.toString()] }

        if (typeof apiConfig.onError === 'function') {
          apiConfig.onError(responseData)
        }

        // Inform the reducer that the request failed
        next({
          ...action,
          type: requestTypeModifer.failureState(action.type),
          payload: responseData,
        })
        return { res: responseData }
      })
  }
  return reduxApiMiddleware
}

export default initReduxApiMiddleware
