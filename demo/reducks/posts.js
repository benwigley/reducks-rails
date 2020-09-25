import { ReducksCollection } from 'reducks-rails'
import reducksSchemas from 'schemas'

// Types
export const DELETE_POST = '<app-namespace>/posts/DELETE_POST'
export const FETCH_CURRENT_USER_POSTS = '<app-namespace>/posts/FETCH_CURRENT_USER_POSTS'

// Reducks class
class Posts extends ReducksCollection {
  constructor() {
    super()

    // Set required properties
    this.schema = reducksSchemas.posts
    this.mainSchema = reducksSchemas

    this.initialState = {
      ...this.initialState,     // important to keep the initial state from the ReducksBaseCollection
      currentUsersPostIds: [],  // manually keep track of the current users posts
      isCreatingProject: null,
      isDeletingProjectId: null,
    }
  }

  // Every Reducks Collection requires a reducer
  reducer(state, action = {}) {
    if (!state) state = this.initialState
    state = super.reducer(state, action, this.collection)
    switch (action.type) {

      // Rails: PostsController#current_user_posts
      case this.requestTypeModifier(FETCH_CURRENT_USER_POSTS):
        return { ...state, isLoading: true }
      case this.successTypeModifier(FETCH_CURRENT_USER_POSTS):
        return this.processApiSuccess({
          state,
          action,
          dataTransformer: (normalizedData, newState) => {
            newState.currentUsersPostIds = normalizedData[this.collection].ids
            return newState
          }
        })
      case this.failureTypeModifier(FETCH_CURRENT_USER_POSTS):
        return this.processApiFailure({ state, action })


      // Rails: PostsController#destroy
      case requestTypeModifer.requestState(DELETE_POST):
        return {
          ...state,
          isDeletingPostId: action.postId,
        }
      case requestTypeModifer.successState(DELETE_POST):
        return this.processApiSuccess({
          state: {
            ...this.removeEntityById(state, action.postId),
            currentUsersPostIds: without(state.currentUsersPostIds, action.postId),
            isDeletingProjectId: null
          },
          action
        })
      case requestTypeModifer.failureState(DELETE_POST):
        return this.processApiFailure({
          state: {
            ...state,
            isDeletingProjectId: null
          },
          action
        })

    }
    return state
  }

  // Actions below are using the "thunk" based format

  fetchCurrentUserPosts(userId) {
    return (dispatch, getState) => {
      // const state = getState()
      return dispatch({
        type: FETCH_CURRENT_USER_POSTS,
        api: {
          method: 'GET',
          url: 'current_user_posts',
          data: {},
          params: { }
        }
      })
    }
  }

  deletePost(postId) {
    return (dispatch) => {
      return dispatch({
        type: DELETE_POST,
        api: {
          method: 'DELETE',
          url: `recipe_projects/${postId}`,
          data: {},
          params: {}
        },
        postId
      })
    }
  }

}

export default new Posts()
