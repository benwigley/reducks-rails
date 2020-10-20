import { isFunction } from 'lodash'
import normalizedMerge from '../../src/libs/normalizedMerge'


const obj1 = {
   entities: { 1: {name: 'One'}, 2: {name: 'Two'} },
   ids: [1, 2]
}
const obj2 = {
   entities: { 2: {name: 'Two'}, 3: {name: 'Three'} },
   ids: [2, 3]
}
const merge1and2result = {
   entities: { 1: {name: 'One'}, 2: {name: 'Two'}, 3: {name: 'Three'} },
   ids: [1, 2, 3]
}


describe('normalizedMerge', () => {

  it('should be a function', () => {
    expect(isFunction(normalizedMerge)).toBe(true)
  })

  it('should merge two normalised objects together', () => {
    expect(normalizedMerge(obj1, obj2)).toEqual(merge1and2result)
  })

  it('should prioritize attributes from the second object', () => {
    expect(normalizedMerge({
      testAttr: 'firstObject'
    }, {
      testAttr: 'secondObject'
    })).toEqual({ testAttr: 'secondObject' })
  })

})
