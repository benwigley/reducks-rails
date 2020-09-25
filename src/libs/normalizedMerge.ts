import { cloneDeep, mergeWith, isArray, union } from 'lodash'
import logger from './logger'
import Collection from '../reducks/CollectionInterface'

// Merges two objects together
// Aids in concatenating two reducks Collections together so
// that all values are included, but duplicates are avoided.
//
// Example:
// Object1 (existingState)
// {
//    entities: { 1: {name: 'One'}, 2: {name: 'Two'} }
//    ids: [1, 2]
// }
// Object2 (newState)
// {
//    entities: { 2: {name: 'Two'}, 3: {name: 'Three'} }
//    ids: [2, 3]
// }
//
// Result:
// {
//    entities: { 1: {name: 'One'}, 2: {name: 'Two'}, 3: {name: 'Three'} }
//    ids: [1, 2, 3]
// }
//
export default function normalizedMerge(existingState: Collection, newState: Collection, shouldLog: boolean = false): Collection {
  if (shouldLog) {
    logger.debug('-----------')
    logger.debug('normalizedMerge')
    logger.debug('existingState', existingState)
    logger.debug('newState', newState)
  }
  return mergeWith(cloneDeep(existingState), newState, function (existingStateProperty, newStateProperty, statePropertyKey) {
    if (shouldLog) {
      logger.debug('statePropertyKey', statePropertyKey)
      logger.debug('existingStateProperty', existingStateProperty)
      logger.debug('newStateProperty', newStateProperty)
      logger.debug('-----------')
    }

    // The 'ids' properties of state should be merge together, not replaced.
    if (statePropertyKey === 'ids' && isArray(existingStateProperty)) {
      if (isArray(newStateProperty)) {
        return union(existingStateProperty, newStateProperty)
      }
      // Usually we override the old attribute with the new one,
      // but in the case of arrays (id arrays), we want to keep that
      // data intact or it would ruin our normalized data state.
      return existingStateProperty
    }
    else if (statePropertyKey === 'entities') {
      // Go one step deeper to avoid entities id lookup arrays being replaced
      // e.g. recipePhaseIds, recipeItemTimeTrackerIds
      return mergeWith(existingStateProperty, newStateProperty, function (existingEntityProperty, newEntityProperty, entityPropertyKey) {
        if (entityPropertyKey.substr(entityPropertyKey.length - 3) == 'Ids') {
          // console.log("=================")
          // console.log('entityPropertyKey', entityPropertyKey)
          // console.log('existingEntityProperty', existingEntityProperty)
          // console.log('newEntityProperty', newEntityProperty)
          // console.log("=================")
        }
        if (entityPropertyKey.substr(entityPropertyKey.length - 3) == 'Ids' && isArray(existingEntityProperty)) {
          if (isArray(newEntityProperty)) return union(existingEntityProperty.concat(newEntityProperty))
          return existingEntityProperty
        }
      })
    }
    if (isArray(existingStateProperty) && !newStateProperty) {
      // Usually we override the old attribute with the new one,
      // but in the case of arrays (id arrays), we want to keep that
      // data intact or it would ruin our normalized data state.
      return existingStateProperty
    }
  })
}
