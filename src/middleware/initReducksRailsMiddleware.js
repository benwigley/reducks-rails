import initReduxApiMiddleware from './middleware/reduxApiMiddleware'
import asyncDispatchMiddleware from './middleware/asyncDispatchMiddleware'

const reducksRailsMiddleware = function(apiConfig) {
  return [
    initReduxApiMiddleware(apiConfig),
    asyncDispatchMiddleware
  ]
}

export default reducksRailsMiddleware
