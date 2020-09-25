import initReduxApiMiddleware from './initReduxApiMiddleware'
import asyncDispatchMiddleware from './asyncDispatchMiddleware'

const initReducksRailsMiddleware = function(apiConfig) {
  return [
    initReduxApiMiddleware(apiConfig),
    asyncDispatchMiddleware
  ]
}

export default initReducksRailsMiddleware
