import { isArray, isFunction } from 'lodash'
import initReducksRailsMiddleware from '../../src/middleware/initReducksRailsMiddleware'


describe('initReducksRailsMiddleware', () => {

  it('should be a function', () => {
    expect(isFunction(initReducksRailsMiddleware)).toBe(true)
  })

  it('should return an array of functions', () => {
    const middlewares = initReducksRailsMiddleware({
      baseUrl: '/'
    })
    expect(isArray(middlewares)).toBe(true)
    middlewares.forEach((middleware) => {
      expect(isFunction(middleware)).toBe(true)
    })
  })

})
