import { isFunction, isArray, isObject, find } from 'lodash'
import normalize from '../../src/libs/normalize'

import testSchema from '../data/testSchema'
import testResponseUsers from '../data/testResponseUsers'
import testResponsePosts from '../data/testResponsePosts'
import testResponseAvatars from '../data/testResponseAvatars'
import testResponseComments from '../data/testResponseComments'


describe('normalize', () => {

  it('should be a function', () => {
    expect(isFunction(normalize)).toBe(true)
  })

  it('should be throw an error when incorrect params given', () => {
    expect(() => {
      normalize([], {}, [])
    }).toThrow(TypeError)
  })

  describe('validate test data', () => {
    expect(typeof testSchema).toBe('object')
    expect(typeof testSchema.users).toBe('object')
    expect(typeof testSchema.users.collection).toBe('string')
    expect(typeof testSchema.users.nested).toBe('object')
  })

  describe('nested collections', () => {

    it('should return nested data in the correct format', () => {
      const normalizedReponse = normalize(testResponseUsers, testSchema.users, testSchema)
      expect(isObject(normalizedReponse)).toBe(true)

      expect(isObject(normalizedReponse.users)).toBe(true)
      expect(isObject(normalizedReponse.posts)).toBe(true)
      expect(isObject(normalizedReponse.comments)).toBe(true)

      expect(isArray(normalizedReponse.users.ids)).toBe(true)
      expect(isArray(normalizedReponse.posts.ids)).toBe(true)
      expect(isArray(normalizedReponse.comments.ids)).toBe(true)

      expect(isObject(normalizedReponse.users.entities)).toBe(true)
      expect(isObject(normalizedReponse.posts.entities)).toBe(true)
      expect(isObject(normalizedReponse.comments.entities)).toBe(true)
    })

    it('should place the postIds in an ids array', () => {
      const normalizedReponse = normalize(testResponseUsers, testSchema.users, testSchema)
      expect(normalizedReponse.posts.ids.length).toEqual(testResponsePosts.length)
    })

    it('should place an object in the "entities" array for each id in the "ids" array', () => {
      const normalizedReponse = normalize(testResponseUsers, testSchema.users, testSchema)
      normalizedReponse.posts.ids.forEach(postId => {
        expect(isObject(normalizedReponse.posts.entities[postId])).toBe(true)
        expect(normalizedReponse.posts.entities[postId].id).toBe(postId)
      })
    })

    it('should be able to handle multiple levels of nesting', () => {
      const normalizedReponse = normalize(testResponseUsers, testSchema.users, testSchema)
      expect(normalizedReponse.comments.ids.length).toEqual(testResponseComments.length)
    })

    it('should be able to handle keys that are singular (models rather than collections)', () => {
      const normalizedReponse = normalize(testResponseUsers, testSchema.users, testSchema)
      expect(isObject(normalizedReponse.avatars)).toBe(true)
      expect(isArray(normalizedReponse.avatars.ids)).toBe(true)
      expect(isObject(normalizedReponse.avatars.entities)).toBe(true)

      const user16 = find(testResponseUsers, u => u.id == 16)
      expect(normalizedReponse.avatars.ids.length).toEqual(testResponseAvatars.length)
      expect(normalizedReponse.avatars.entities[user16.avatar.id]).toEqual(user16.avatar)
    })

  })

})
