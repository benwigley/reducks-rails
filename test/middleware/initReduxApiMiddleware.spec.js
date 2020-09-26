import { isFunction } from 'lodash'
import initReduxApiMiddleware from '../../src/middleware/initReduxApiMiddleware'


describe('initReduxApiMiddleware', () => {

  it('should be a function', () => {
    expect(isFunction(initReduxApiMiddleware)).toBe(true)
  })

})
