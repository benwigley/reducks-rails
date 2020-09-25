// https://github.com/axios/axios
import axios from 'axios'
import humps from 'humps'
import logger from './logger'
import { defaults } from 'lodash'

function initApi(apiConfig={}) {

  // `apiConfig` has come from the developer
  // so will take priority over our defaults
  apiConfig = defaults(apiConfig, {
    debug: false,
    baseUrl: '/',
    axiosConfig: {}, // user may supply config directly to axios
    camelCaseClientData: true,
    snakeCaseServerData: true,
  })

  // Tranform the request from camel to snake case and give the
  // developer the option to perform their own transformations
  const transformRequest = [
    ...axios.defaults.transformRequest,
    (data, headers) => {
      // Convert from camelCase to snake_case
      if (apiConfig.snakeCaseServerData) { return humps.decamelizeKeys(data) }
      return data
    }
  ]
  if (typeof apiConfig.transformRequest === 'function') {
    transformRequest.push(apiConfig.transformRequest)
  }

  // Tranform the response from snake to camel case and give the
  // developer the option to perform their own transformations
  const transformResponse = [
    ...axios.defaults.transformResponse,
    (data, headers) => {
      // Convert from Rails snake_case to JS camelCase
      if (apiConfig.camelCaseClientData) { return humps.camelizeKeys(data) }
      return data
    }
  ]
  if (typeof apiConfig.transformResponse === 'function') {
    transformResponse.push(apiConfig.transformResponse)
  }

  // Take any axio config give by the user
  let axiosConfig = defaults(apiConfig.axiosConfig, {
    baseURL: apiConfig.baseUrl,
    withCredentials: false, // This threw an error when set to true
    timeout: 20000,
    headers: defaults(apiConfig.axiosConfig.headers || {}, {
      'Content-Type': 'application/json'
    }),
    responseType: 'json',
    transformRequest,
    transformResponse
  })

  const api = axios.create(axiosConfig)

  // Give the developer access to the final api object
  if (typeof apiConfig.accessApiObject === 'function') {
    apiConfig.accessApiObject(api)
  }

  return api
}

export default initApi
