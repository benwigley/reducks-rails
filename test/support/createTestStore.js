import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

import testSchema from '../data/testSchema'
import registerCollections from '../../src/reducks/registerCollections'
import ReducksBaseCollection from '../../src/reducks/ReducksBaseCollection'
import initReducksRailsMiddleware from '../../src/middleware/initReducksRailsMiddleware'


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
class Comments extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = testSchema.comments
    this.mainSchema = testSchema
  }
}
class Avatars extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = testSchema.avatars
    this.mainSchema = testSchema
  }
}

export const users = new Users()
export const avatars = new Avatars()
export const posts = new Posts()
export const comments = new Comments()

export const createTestStore = (inConfig, initialState={}) => {
  return createStore(
    combineReducers(
      registerCollections(users, avatars, posts, comments)
    ),
    initialState,
    compose(applyMiddleware(
      thunkMiddleware,
      ...initReducksRailsMiddleware(inConfig)
    ))
  )
}

export default createTestStore
