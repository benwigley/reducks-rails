import normalize from './libs/normalize'
import normalizedMerge from './libs/normalizedMerge'
import entitySelectors from './libs/entitySelectors'
import mergeStateIntoState from './libs/mergeStateIntoState'
import actionTypeModifiers from './libs/actionTypeModifiers'
import registerCollections from './reducks/registerCollections'
import {
  ReducksBaseCollection,
  setEntities as setEntitiesAction,
  setEntitiesFromState as setEntitiesFromStateAction
} from './reducks/ReducksBaseCollection'
import initReducksRailsMiddleware from './middleware/initReducksRailsMiddleware'

export {
  // Reducks stuff
  normalize,
  normalizedMerge,
  mergeStateIntoState,
  actionTypeModifiers,
  registerCollections,
  entitySelectors,

  setEntitiesAction,
  setEntitiesFromStateAction,
  ReducksBaseCollection,

  // Middleware stuff
  initReducksRailsMiddleware,
}
