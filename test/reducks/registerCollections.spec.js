import { isFunction } from 'lodash'
import testSchema from '../data/testSchema'
import registerCollections from '../../src/reducks/registerCollections'
import ReducksBaseCollection from '../../src/reducks/ReducksBaseCollection'

class Users extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = testSchema.users
    this.mainSchema = testSchema
  }
}
class Posts extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = testSchema.posts
    this.mainSchema = testSchema
  }
}

const users = new Users()
const posts = new Posts()


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
