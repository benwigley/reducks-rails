import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import logger from 'redux-logger'
import {
  registerCollections,
  initReducksRailsMiddleware
} from 'reducks-rails'

// Reducks Collections
import users from './reducks/users'
import posts from './reducks/posts'
import comments from './reducks/comments'

// This would be your actual node session
const sessionStorage = {}

const reducksRailsConfig = {
  debug: true,
  baseUrl: 'http://localhost:3000/',         // (required)
  axiosConfig: {        // (optional)
    // pass configuration directly to axios (ajax utility)
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  },
  camelCaseClientData: true,
  snakeCaseServerData: true,

  onResponseError: (res, { store }) => {},   // (optional)

  parse: (json) => {
    return json
  },
  setMetaData: (json) => {
    return {}
  },

  // Modify the recieved response data
  transformResponse: (data, headers) => { return data },
  // Modify the request data before it is sent
  transformRequest: (data, headers) => { return data },

  // Token-based authentication example.
  // Could also use transform methods above instead.
  accessFinalApiObject: (api) => {
    // Save any auth headers from the response so they can be set in future requests
    api.interceptors.response.use((response) => {
      if (typeof response.headers !== 'object') { return response }
      ['access-token', 'token-type'].forEach(headerName => {
        sessionStorage[headerName] = response.headers[headerName]
      })
      return response
    })
    // Set any saved auth headers when sending requests
    api.interceptors.request.use((request) => {
      if (typeof request.headers !== 'object') { return request }
      ['access-token', 'token-type'].forEach(headerName => {
        if (!sessionStorage[headerName]) { return }
        request['headers'][headerName] = sessionStorage[headerName]
      })
      return request
    })
  }
}

export default (initialState = {}) => {
  const store = createStore(
    combineReducers({
      // reducerName: myOtherReducer
      ...registerCollections(users, posts, comments)
    }),
    initialState,
    compose(applyMiddleware(
      thunkMiddleware, // !IMPORTANT: Place thunk at the top
      logger,
      ...initReducksRailsMiddleware(reducksRailsConfig)
    ))
  )
  if (typeof window !== 'undefined') {
    window.users = users
    window.posts = posts
    window.comments = comments
    window.store = store // so you can play with the store in the console for the demo
  }
  return store
}
