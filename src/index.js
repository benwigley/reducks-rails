import normalize from './libs/normalize.ts'
import normalizedMerge from './libs/normalizedMerge.ts'
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
  actionTypeModifiers,
  registerCollections,

  setEntitiesAction,
  setEntitiesFromStateAction,
  ReducksBaseCollection,

  // Middleware stuff
  initReducksRailsMiddleware,
}
