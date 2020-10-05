import { mergeWith } from 'lodash'
import normalizedMerge from './normalizedMerge'

export const mergeStateIntoState = (state1, state2) => {
  return mergeWith(state1, state2, (state1Property, state2Property, propertyKey) => {
    // prioritize non-null values in the second state
    if (!state1Property) { return state2Property }
    if (!state2Property) { return state1Property }
    return normalizedMerge(state1Property, state2Property)
  })
}

export default mergeStateIntoState
