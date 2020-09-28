import logger from '../libs/logger'
import normalize from '../libs/normalize'
import actionTypeModifiers from '../libs/actionTypeModifiers'
import normalizedMerge from '../libs/normalizedMerge'
import { sortBy, isArray } from 'lodash'

//
// ReducksBaseCollection guidelines:
//
// Each inheriting class must:
// - MUST define a schema property in it's contructor, usually mainSchema.<collectionName>
// - MUST define a mainSchema property in it's contructor
//


// Types
export const SET_ENTITIES             = 'reducksRails/entities/SET_ENTITIES'
export const SET_ENTITIES_FROM_STATE  = 'tjmer/entities/SET_ENTITIES_FROM_STATE'

// Global Action Creators
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

// REST Action Types
const INDEX   = 'INDEX'
const SHOW    = 'SHOW'
const CREATE  = 'CREATE'
const UPDATE  = 'UPDATE'
const DESTROY = 'DESTROY'


export class ReducksBaseCollection {

  constructor() {

    // IMPORTANT These must be overriden by child classes!
    this.schema = null
    this.mainSchema = null // '{ users: { collection: 'users', etc... } }'

    // Set this to an attribute to have your collection ordered
    this.orderBy = null
    this.reverseOrder = false

    // Warning: Don't change these to use the modern function declaration
    //          e.g. () => {}
    //          It breaks things for some reason.
    this.reducer = this.reducer.bind(this)
    this.processApiRequest = this.processApiRequest.bind(this)
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
    if (!state) { state = this.initialState }

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

      //
      // Default REST Resource Actions
      //

      // POST /:collectionName
      case this.requestTypeModifier(`${this.getCollection()}.${INDEX}`):
        console.log(`Reducer#${this.getCollection()}, INDEX request`);
        return this.processApiRequest({
          state: { ...state, isLoadingIndex: true },
          action
        })
      case this.successTypeModifier(`${this.getCollection()}.${INDEX}`):
        return this.processApiSuccess({
          state: { ...state, isLoadingIndex: false },
          action
        })
      case this.failureTypeModifier(`${this.getCollection()}.${INDEX}`):
        return this.processApiFailure({
          state: { ...state, isLoadingIndex: false },
          action
        })

      // POST /:collectionName
      case this.requestTypeModifier(`${this.getCollection()}.${CREATE}`):
        console.log(`Reducer#${this.getCollection()}, CREATE request`);
        return this.processApiRequest({
          state: { ...state, isCreatingEntity: action.data },
          action
        })
      case this.successTypeModifier(`${this.getCollection()}.${CREATE}`):
        return this.processApiSuccess({
          state: { ...state, isCreatingEntity: null },
          action
        })
      case this.failureTypeModifier(`${this.getCollection()}.${CREATE}`):
        return this.processApiFailure({
          state: { ...state, isCreatingEntity: null },
          action
        })

      // GET /:collectionName/:id
      case this.requestTypeModifier(`${this.getCollection()}.${SHOW}`):
        console.log(`Reducer#${this.getCollection()}, SHOW request`);
        return this.processApiRequest({
          state: { ...state, isFetchingEntityId: action.id },
          action
        })
      case this.successTypeModifier(`${this.getCollection()}.${SHOW}`):
        return this.processApiSuccess({
          state: { ...state, isFetchingEntityId: null },
          action
        })
      case this.failureTypeModifier(`${this.getCollection()}.${SHOW}`):
        return this.processApiFailure({
          state: { ...state, isFetchingEntityId: null },
          action
        })

      // PUT /:collectionName/:id
      case this.requestTypeModifier(`${this.getCollection()}.${UPDATE}`):
        console.log(`Reducer#${this.getCollection()}, UPDATE request`);
        return this.processApiRequest({
          state: { ...state, isUpdatingEntityId: action.id },
          action
        })
      case this.successTypeModifier(`${this.getCollection()}.${UPDATE}`):
        return this.processApiSuccess({
          state: { ...state, isUpdatingEntityId: null },
          action,
          // Example of transforming the final state returned from this.processApiSuccess
          // dataTransformer: (normalizedData, newState) => {
          //   newState.thing = action.payload.thing
          //   return newState
          // }
        })
      case this.failureTypeModifier(`${this.getCollection()}.${UPDATE}`):
        return this.processApiFailure({
          state: { ...state, isUpdatingEntityId: null },
          action
        })

      // DELETE /:collectionName/:id
      case this.requestTypeModifier(`${this.getCollection()}.${DESTROY}`):
        console.log(`Reducer#${this.getCollection()}, DESTROY request`);
        return this.processApiRequest({
          state: { ...state, isDeletingEntityId: action.id },
          action
        })
      case this.successTypeModifier(`${this.getCollection()}.${DESTROY}`):
        return this.processApiSuccess({
          state: { ...this.removeEntityById(state, action.id), isDeletingEntityId: null },
          action
        })
      case this.failureTypeModifier(`${this.getCollection()}.${DESTROY}`):
        return this.processApiFailure({
          state: { ...state, isDeletingEntityId: null },
          action
        })

    }
    return state
  }

  processApiRequest({ state, action }) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:processApiRequest`)
    return { ...state, isLoading: true }
  }

  processApiSuccess({ state, action, dataTransformer }) {
    logger.log(`ReducksBaseCollection:${this.constructor.name}:processApiSuccess`)
    if (!dataTransformer) dataTransformer = (normalizedData, newState) => newState

    const returnState = {
      ...state,
      isLoading: false,
      lastRequestSuccesful: true,
      errors: [],
      metaData: {
        ...state.metaData,
        ...action.payload.metaData
      },
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
      // The entity is to be deleted, so skip it by returning
      if (entityIdsToDelete.includes(id)) { return }
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

  // REST Actions
  index(queryParams={}) {
    return {
      type: `${this.getCollection()}.${INDEX}`,
      api: {
        method: 'GET',
        url: `${this.getCollection()}`,
        params: queryParams
      }
    }
  }
  create(attributes) {
    return {
      type: `${this.getCollection()}.${CREATE}`,
      api: {
        method: 'POST',
        url: `${this.getCollection()}`,
        data: attributes
      }
    }
  }
  show(id, queryParams) {
    return {
      type: `${this.getCollection()}.${SHOW}`,
      api: {
        method: 'GET',
        url: `${this.getCollection()}/${id}`,
        params: queryParams
      }
    }
  }
  update(id, attributes) {
    return {
      type: `${this.getCollection()}.${UPDATE}`,
      api: {
        method: 'PUT',
        url: `${this.getCollection()}/${id}`,
        data: attributes
      }
    }
  }
  destroy(id) {
    return {
      type: `${this.getCollection()}.${DESTROY}`,
      api: {
        method: 'DELETE',
        url: `${this.getCollection()}/${id}`
      }
    }
  }
}

ReducksBaseCollection.prototype.initialState = {
  // Api Fetching states
  isLoading: false,
  isLoadingIndex: false,
  isCreatingEntity: null,
  isFetchingEntityId: null,
  isDeletingEntityId: null,
  lastRequestSuccesful: null,
  errors: [],
  ids: [],
  entities: {},
}

export default ReducksBaseCollection
