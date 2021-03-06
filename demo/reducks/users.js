import { ReducksBaseCollection } from 'reducks-rails'
import mainSchema from './schema'


// Types
export const UPDATE_USER_FIRST_NAME = '<app-namespace>/users/UPDATE_USER_FIRST_NAME'


// Reducks class
class Users extends ReducksBaseCollection {

  constructor() {
    super()

    // Set required properties
    this.schema = mainSchema.users
    this.mainSchema = mainSchema

    this.initialState = {
      ...this.initialState,
      isUpdatingUserId: null
    }
  }

  reducer(state, action = {}) {

    state = super.reducer(state, action)
    switch (action.type) {

      // Rails: UsersController#update
      case this.requestTypeModifier(UPDATE_USER_FIRST_NAME):
        return { ...state, isUpdatingUserId: action.userid }
      case this.successTypeModifier(UPDATE_USER_FIRST_NAME):
        return this.processApiSuccess({
          state: {
            ...state,
            isUpdatingUserId: null
          },
          action
        })
      case this.failureTypeModifier(UPDATE_USER_FIRST_NAME):
        return this.processApiFailure({
          state: {
            ...state,
            isUpdatingUserId: null
          },
          action
        })


      default:
        return state
    }
  }

}


// Actions

export function updateUserFirstName(userId, firstName) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_USER_FIRST_NAME,
      api: {
        method: 'PUT',
        url: `users/${userId}`,
        data: {
          user: {
            firstName: firstName
          }
        },
        params: {}
      },
      userId
    })
  }
}

export default new Users()
