import shared from '../libs/shared'
import initReduxApiMiddleware from './initReduxApiMiddleware'
import asyncDispatchMiddleware from './asyncDispatchMiddleware'

const initReducksRailsMiddleware = function(inConfig) {
  shared.inConfig = inConfig
  return [
    initReduxApiMiddleware(inConfig),
    asyncDispatchMiddleware
  ]
}

export default initReducksRailsMiddleware
