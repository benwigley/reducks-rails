import { isObject, isFunction } from 'lodash'
import shared from '../libs/shared'

// Returns a hash of reducers to be passed into combineReducers like so:
//  combineReducers({
//    myOtherReducer,
//    ...registerCollections({ users, posts })
//  })

export default (...collections) => {
  shared.collections = collections

  const reducersHash = {}

  collections.forEach((collection) => {
    // Error check
    if (!collection.schema || !isObject(collection.schema) || !collection.schema.collection) {
      throw new TypeError('Collection#schema should be an object in the format { collection: "users", ... }. See docs for more options');
    }
    if (!collection.reducer || !isFunction(collection.reducer)) {
      throw new TypeError('Collection#reducer should be a function');
    }
    reducersHash[collection.schema.collection] = collection.reducer
  })

  return reducersHash
}
