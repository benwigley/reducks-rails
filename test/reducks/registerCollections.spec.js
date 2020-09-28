import { isFunction } from 'lodash'
import registerCollections from '../../src/reducks/registerCollections'
import { users, posts } from '../support/createTestStore'


describe('registerCollections', () => {

  it('should be a function', () => {
    expect(isFunction(registerCollections)).toBe(true)
  })

  it('should have valid test data', () => {
    expect(isFunction(users)).toEqual(false)
    expect(isFunction(posts)).toEqual(false)
  })

  it('should return an object with only the reducers from the collections', () => {
    const registeredCollections = registerCollections(users, posts)
    expect(registeredCollections.users).toBe(users.reducer)
    expect(registeredCollections.posts).toBe(posts.reducer)
  })

})
