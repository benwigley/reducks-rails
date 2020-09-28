import { isFunction, isObject, isArray } from 'lodash'
import entitySelectors from '../../src/libs/entitySelectors'

import testResponseUsers from '../data/testResponseUsers'
import testSchema from '../data/testSchema'
import normalize from '../../src/libs/normalize'
const testResource = normalize(testResponseUsers, testSchema.users, testSchema).users

describe('entitySelectors', () => {

  it('should be an object', () => {
    expect(isObject(entitySelectors)).toBe(true)
  })

  describe('validate test data', () => {
    expect(typeof testResource).toBe('object')
    expect(isArray(testResource.ids)).toBe(true)
    expect(testResource.ids.length).toBe(2)
    expect(isObject(testResource.entities)).toBe(true)
  })

  describe('getEntitiesArray', () => {
    it('should return a list of entities', () => {
      const result = entitySelectors.getEntitiesArray(testResource)
      expect(isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })
  })

  describe('where', () => {
    it('should be a function', () => {
      expect(isFunction(entitySelectors.where)).toBe(true)
    })

    it('should throw an error when invalid resource param given', () => {
      const attrs = { id: 3 }
      expect(() => { entitySelectors.where(null, attrs) }).toThrow(TypeError)
      expect(() => { entitySelectors.where({ entities: {}, ids: null }, attrs) }).toThrow(TypeError)
      expect(() => { entitySelectors.where({ entities: null, ids: [] }, attrs) }).toThrow(TypeError)
    })

    it('should not throw an error when a valid resource param given', () => {
      const attrs = { id: 3 }
      expect(() => { entitySelectors.where({ entities: {}, ids: [] }, attrs) }).not.toThrowError()
    })

    it('should return an entity that matches attributes', () => {
      const result = entitySelectors.where(testResource, { id: 14 })
      expect(result.length).toBe(1)
      expect(result[0].id).toBe(14)
    })
  })

  describe('findWhere', () => {
    it('should return the first entity found', () => {
      const result = entitySelectors.findWhere(testResource, { id: 14 })
      expect(isObject(result)).toBe(true)
      expect(result.id).toBe(14)
    })
  })

  describe('map', () => {
    it('should return the first entity found', () => {
      const result = entitySelectors.map(testResource, entity => entity.name)
      expect(isArray(result)).toBe(true)
      expect(result[0]).toBe(testResponseUsers[0].name)
    })
  })

  describe('filter', () => {
    it('should return the first entity found', () => {
      const userId = testResponseUsers[0].id
      const result = entitySelectors.filter(testResource, entity => entity.id == userId)
      expect(isArray(result)).toBe(true)
      expect(result[0].id).toBe(userId)
    })
  })

})
