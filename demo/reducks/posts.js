import { ReducksBaseCollection } from 'reducks-rails'
import mainSchema from './schema'

// Types
export const FETCH_CURRENT_USER_POSTS = '<app-namespace>/posts/FETCH_CURRENT_USER_POSTS'

// Reducks class
class Posts extends ReducksBaseCollection {
  constructor() {
    super()

    // Set required properties
    this.schema = mainSchema.posts
    this.mainSchema = mainSchema

    this.initialState = {
      ...this.initialState,     // important to keep the initial state from the ReducksBaseCollection
      currentUsersPostIds: [],  // manually keep track of the current users posts
    }
  }

  reducer(state, action = {}) {

    // Required: a custom reducer must always call the parent reducer
    state = super.reducer(state, action)

    switch (action.type) {

      // Rails: PostsController#current_user_posts
      case this.requestTypeModifier(FETCH_CURRENT_USER_POSTS):
        return this.processApiRequest({ state })
      case this.successTypeModifier(FETCH_CURRENT_USER_POSTS):
        return this.processApiSuccess({
          state,
          action,
          dataTransformer: (normalizedData, newState) => {
            // Posts will have gone into the state normlaized as {entities, ids}, but
            // let's keep a record of which posts in state are the current user's posts
            newState.currentUsersPostIds = normalizedData[this.schema.collection].ids
            return newState
          }
        })
      case this.failureTypeModifier(FETCH_CURRENT_USER_POSTS):
        return this.processApiFailure({ state, action })

    }
    return state
  }

  // Custom Actions

  fetchCurrentUserPosts(userId) {
    return (dispatch, getState) => {
      // const state = getState()
      return dispatch({
        type: FETCH_CURRENT_USER_POSTS,
        api: {
          method: 'GET',
          url: 'current_user_posts',
          data: {},   // ajax data
          params: {}  // queryParams
        }
      })
    }
  }

}

export default new Posts()
