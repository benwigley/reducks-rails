import thunkMiddleware from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {
  reducksRailsMiddleware
} from 'reducks-rails'

// Reducers
import users from './reducks/users'
import posts from './reducks/posts'

// This would be your actual node session
const sessionStorage = {}

const reducksRailsConfig = {
  baseUrl: '/',         // (required)
  onError: () => { },   // (optional)
  axiosConfig: {        // (optional)
    // pass configuration directly to axios (ajax utility)
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  },
  camelCaseClientData: true,
  snakeCaseServerData: true,

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
  return createStore(
    combineReducers({
      posts: posts.reducer,
      users: users.reducer,
    }),
    initialState,
    compose(applyMiddleware([
      thunkMiddleware, // !IMPORTANT: Place thunk at the top
      ...reducksRailsMiddleware(reducksRailsConfig)
    ]))
  )
}
