import { isFunction, isObject, isObjectLike } from 'lodash'
import { initReduxApiMiddleware, parseResult } from '../../src/middleware/initReduxApiMiddleware'
import testConfig from '../data/testConfig'
import testResponseUsers from '../data/testResponseUsers'
import createTestStore from '../support/createTestStore'

describe('parseResult', () => {

  it('should be a function', () => {
    expect(isFunction(parseResult)).toBe(true)
  })

  it('returns an object in format: { response, metaData }', () => {
    const result = parseResult(testResponseUsers, testConfig)
    expect(isObject(result)).toBe(true)
    expect(isObjectLike(result.data)).toBe(true)
    expect(isObjectLike(result.metaData)).toBe(true)
  })

  it('applies a parse method when given', () => {
    testConfig.parse = (data) => {
      return { hello: 'there' }
    }
    const result = parseResult(testResponseUsers, testConfig)
    expect(result.data.hello).toEqual('there')
  })

  it('applies a setMetaData method when given', () => {
    testConfig.setMetaData = (data) => {
      return { meta: 'data' }
    }
    const result = parseResult(testResponseUsers, testConfig)
    expect(result.metaData.meta).toEqual('data')
  })

})

describe('initReduxApiMiddleware', () => {

  it('should be a function', () => {
    expect(isFunction(initReduxApiMiddleware)).toBe(true)
  })

  it('should return a function', () => {
    const result = initReduxApiMiddleware(testConfig)
    expect(isFunction(result)).toBe(true)
  })

  it('should successfully allow a redux store to be created', () => {
    const store = createTestStore(testConfig)
    expect(isObject(store)).toBe(true)
    expect(isFunction(store.dispatch)).toBe(true)
  })

  // TODO: Write more specs that actually test the inner workings of the middleware

})
