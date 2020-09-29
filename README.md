# ReducksRails

[![Build Status](https://travis-ci.com/benwigley/reducks-rails.svg?branch=master)](https://travis-ci.com/benwigley/reducks-rails)

Connect your app to Rails with Redux using the Ducks pattern and Rails-like Collections.

## Overview

The ReducksRails module does the following

* Provides a framework for implementing similar Collection/Model structures in your client app to those you use in your backend Rails app.
  * e.g. Say you have a User model in Rrails
    * `class Users extends ReducksBaseCollection { ... }`
    * ReducksRails Collections are always defined as plural, unlike Rails models
  * Handles api calls using redux, thunk, and axios
    * Exposes RESTful methods on collections by default: `index|show|create|update|delete()`
    * Can be easily extended for custom api actions/calls
    * Is easily configurable, with full access to the axios object if required
      * Useful for modifying headers for token auth etc
  * Allows you to define relationships in Collections similar to Rails
    * e.g. in the Users collection constructor: `this.hasMany('posts')` or `this.hasOne('avatar', { collection: 'avatars', foreignKey: 'userId' })`

* Normalizes all the models and collections returned from your json api into collection objects on the redux store
  * Each collection is normalized down into an `entities` object, and an `ids` array
  * `store.getState()` would be `{ users: {entities: {<id>: <model>, ...}, ids: [<id>, ...] }, <other-collections> }`
  * Can normalize deeply nested models and collections in the api response

* Works in seamlessly with React apps, as most redux-based libraries do

Note: ReducksRails is actually framework agnostic. You don't need to be using Rails at all, it's just a nice companion module due to the similar naming conventions.


## Basic Installation

Note: This is a basic one-file example, see the [Demo directory](demo) for an in-detail multi-file example project

```javascript
import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { registerCollections, initReducksRailsMiddleware, ReducksBaseCollection } from 'reducks-rails'

const mainSchame = {
  users: {
    collection: 'users',      // 'collection' required for base collections
    nested: [{
      key: 'avatar',          // 'key' is required for nested schemas only
      collection: 'avatars',  // 'collection' is required for nested schemas
    }]
  },
  avatars: {
    collection: 'avatars'
  }
}

class Users extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = schema.users
    this.mainSchame = mainSchame
  }
}
const users = new Users()

class Avatars extends ReducksBaseCollection {
  constructor() {
    super()
    this.schema = schema.avatars
    this.mainSchame = mainSchame
  }
}
const avatars = new Avatars()

store = createStore(
  combineReducers({
    // reducerName: myOtherReducer
    ...registerCollections(users, avatars)
  }),
  initialState,
  compose(applyMiddleware(
    thunkMiddleware, // !IMPORTANT: Place thunk before ReducksRails middleware
    logger,
    ...initReducksRailsMiddleware({
      baseUrl: 'http://localhost:3000/'
    })
  ))
)

// Example REST api calls
store.dispatch(avatars.index(), { page: 2 }).then((data) => {
  console.log({ data });
})
store.dispatch(avatars.create({ name: 'foo', email: 'foor@bar.com', password: 'mySecret' })))
store.dispatch(avatars.update(12, { name: 'bar' }))
store.dispatch(avatars.show(12))
store.dispatch(avatars.delete(12))
```

## Docs todo

Things to cover

* Extending `ReducksBaseCollection`, full options
* Explaining full configuration options
* Showing a React example
* Show examples of using `entitySelectors.where|map|filter()`
* Show examples of custom a reducer
* Cover loading states: isLoading, isLoadingIndex, isCreatingEntity, isFetchingEntityId, isDeletingEntityId


## Project todo

* Remove thunk dependency based on [redux-rails](https://github.com/instacart/redux-rails)
* Add request queuing (also based on redux-rails)
* Potentially add a way to create singular Resources
  * e.g. CurrentUser vs Users to fetch the authenticaed user
  * For now maybe some docs on how to implement a custom example such as currentUser in the Users collection
