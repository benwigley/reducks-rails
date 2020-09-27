import logger from '../libs/logger'
import normalize from '../libs/normalize'
import actionTypeModifiers from '../libs/actionTypeModifiers'
import normalizedMerge from '../libs/normalizedMerge'
import { sortBy, isArray } from 'lodash'

//
// Redux Ducks guidelines:
//
// Each ducks file must:
// - MUST export default a function called reducer()
// - MUST export its action creators as functions
// - MUST have action types in the form `npm-module-or-app/reducer/ACTION_TYPE`
// - MAY export its action types as UPPER_SNAKE_CASE, if an external reducer
//   needs to listen for them, or if it is a published reusable library.
//


// Note:
// Redux-ORM looks like a library that has already done much of what I'm doing.
// I like my simple approach, but if I want ideas, check that lib out.
// https://github.com/redux-orm/redux-orm


// Types
export const SET_ENTITIES             = 'reducksRails/entities/SET_ENTITIES'
export const SET_ENTITIES_FROM_STATE  = 'tjmer/entities/SET_ENTITIES_FROM_STATE'

// Action Creators
export function setEntities(normalizedData) {
  return {
    type: SET_ENTITIES,
    normalizedData
  }
}

export function setEntitiesFromState(state) {
  return {
    type: SET_ENTITIES_FROM_STATE,
    state,
  }
}

export class ReducksBaseCollection {

  constructor() {

    // IMPORTANT These must be overriden!
    this.schema = null
    this.mainSchema = null // '{ users: { collection: 'users', etc... } }'

    // Set this to an attribute to have your collection ordered
    this.orderBy = null
    this.reverseOrder = false

    // Warning: Don't change these to use the modern function declaration
    //          e.g. () => {}
    //          It breaks things for some reason.
    this.reducer = this.reducer.bind(this)
    this.processApiSuccess = this.processApiSuccess.bind(this)
    this.processApiFailure = this.processApiFailure.bind(this)

    // Request Action Type Modifiers
    this.requestTypeModifier = actionTypeModifiers.requestTypeModifier
    this.successTypeModifier = actionTypeModifiers.successTypeModifier
    this.failureTypeModifier = actionTypeModifiers.failureTypeModifier
  }

  getCollection() {
    return this.getCollectionSchema().collection
  }

  getCollectionSchema() {
    // Validate that the schema has been set,
    // that is is an object, and that it has
    // a collection property that is a string
    if (!this.schema || typeof this.schema != 'object') {
      throw new Error("Collections must set this.schema in contsructor(). Expected type 'object', got type '" + typeof this.schema + "'")
    }
    if (!this.schema.collection || typeof this.schema.collection != 'string') {
      throw new Error("Expected this.schema.collection to be of type 'string', but got type '" + typeof this.schema.collection + "'")
    }
    return this.schema
  }

  getMainSchema() {
    if (!this.mainSchema || typeof this.mainSchema != 'object') {
      throw new Error("Collections must set this.mainSchema in contsructor(). Expected type 'object', but got type '" + typeof this.mainSchema + "'")
    }
    return this.mainSchema
  }

  orderIds(ids, entities) {
    if (this.orderBy) {
      return sortBy(ids, id => {
        if (this.reverseOrder) {
          return -(entities[id][this.orderBy])
        }
        return entities[id][this.orderBy]
      })
    }
    return ids
  }

  reducer(state, action = {}) {
    let finalStateBeforeOrdering

    if (!state) {
      // Default state
      state = {
        entities: {},
        ids: [],
      }
    }

    switch (action.type) {

      // This action expects normalizedData to be a normalized
      // data object returned from the api middleware.
      case SET_ENTITIES:
        if (!action.normalizedData[this.schema.collection]) return state
        logger.debug(`${SET_ENTITIES}:${this.schema.collection}`, action.normalizedData[this.schema.collection])
        finalStateBeforeOrdering = normalizedMerge(state, {
          entities: action.normalizedData[this.schema.collection].entities,
          ids: action.normalizedData[this.schema.collection].ids
        })
        return {
          ...finalStateBeforeOrdering,
          ids: this.orderIds(finalStateBeforeOrdering.ids, finalStateBeforeOrdering.entities)
        }


      // Allows setting of entities from state, ie. store.getState()
      // Useful for saving state for later in localStorage etc
      case SET_ENTITIES_FROM_STATE:
        if (!action.normalizedData[collection]) return state
        logger.debug(`${SET_ENTITIES_FROM_STATE}:${collection}`, action.normalizedData[collection])
        finalStateBeforeOrdering = normalizedMerge(state, action.normalizedData[collection])
        return {
          ...finalStateBeforeOrdering,
          ids: this.orderIds(finalStateBeforeOrdering.ids, finalStateBeforeOrdering.entities)
        }

    }
    return state
  }

  processApiSuccess({ state, action, dataTransformer }) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:processApiSuccess`)
    if (!dataTransformer) dataTransformer = (normalizedData, newState) => newState

    const returnState = {
      ...state,
      isLoading: false,
      lastRequestSuccesful: true,
      errors: [],
      metaData: action.payload.metaData,
    }

    if (!action.payload.response) {
      return returnState
    }

    // Handle destroy requests where no base entity or collection
    // is returned, but other nested items are present in the payload
    if (!action.payload.response.id && !isArray(action.payload.response)) {

      // An entity was probably deleted, but there might be other
      // models or collections of models, so check before continuing.
      if (action.payload.response && isArray(this.getCollectionSchema().nested)) {
        this.getCollectionSchema().nested.forEach(nestedSchema => {
          // Check if a relation exists
          if (action.payload.response[nestedSchema.key]) {
            // It doesn't, so find the schema for that relation
            const relationsSchema = this.getMainSchema()[nestedSchema.collection]
            const normalizedData = normalize(action.payload.response[nestedSchema.key], relationsSchema, this.getMainSchema())
            action.asyncDispatch(setEntities(normalizedData))
          }
        })
      }

      return returnState
    }

    const normalizedData = normalize(action.payload.response, this.getCollectionSchema(), this.getMainSchema())
    action.asyncDispatch(setEntities(normalizedData))
    // Fist, merge the newState into the old state
    let newState = normalizedMerge(state, {
      ids: normalizedData[this.getCollection()].ids,
      entities: normalizedData[this.getCollection()].entities,
      isLoading: false,
      lastRequestSuccesful: true,
      errors: []
    })
    // Second, merge the result of the dataTransformer function into the newState
    const finalStateBeforeOrdering = normalizedMerge(newState, dataTransformer(normalizedData, newState))
    return {
      ...finalStateBeforeOrdering,
      ids: this.orderIds(finalStateBeforeOrdering.ids, finalStateBeforeOrdering.entities)
    }
  }

  processApiFailure({ state, action }) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:processApiFailure`)
    return {
      ...state,
      isLoading: false,
      lastRequestSuccesful: false,
      errors: action.payload.errors
    }
  }

  removeEntityById(state, entityToDeleteId) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:removeEntityById:${entityToDeleteId}`)
    return this.removeEntitiesById(state, [entityToDeleteId])
  }

  removeEntitiesById(state, entityIdsToDelete) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:removeEntityById:${entityIdsToDelete}`)
    let updatedEntities = {}
    let updatedIds = []
    state.ids.forEach((id) => {
      const entity = { ...state.entities[id] }
      if (entityIdsToDelete.includes(id)) {
        // The entity is to be deleted, so skip it
        return
      }
      // Add all other entities
      updatedEntities[id] = entity
      updatedIds.push(id)
    })
    return {
      ...state,
      entities: updatedEntities,
      ids: updatedIds
    }
  }

  // fetchSomething() {
  //   return (dispatch, getState) => {
  //     // const state = getState()
  //     return dispatch({
  //       type: FETCH_SOMETHING,
  //       api: {
  //         method: 'GET',
  //         url: 'something',
  //         data: {},
  //         params: {}
  //       }
  //     })
  //   }
  // }
}

ReducksBaseCollection.prototype.initialState = {
  // Api Fetching states
  isLoading: false,
  lastRequestSuccesful: null,
  errors: [],
  ids: [],
  entities: {}
}

export default ReducksBaseCollection
