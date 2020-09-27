import { isFunction } from 'lodash'
import normalizedMerge from '../../src/libs/normalizedMerge'


describe('normalizedMerge', () => {

  it('should be a function', () => {
    expect(isFunction(normalizedMerge)).toBe(true)
  })

})
