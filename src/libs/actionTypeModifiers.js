// Explanation of the redux pattern used here.
// The example we'll use is an api call:
//    An api call has three states, 'request', and 'success' or 'failue'.
//    Instead of creating three different redux "types" and creating a
//    bloated list of types for each ducks file, we just have one base type
//    that decribes the api call, e.g. FETCH_CURRENT_USER. We can use the functions
//    below to get a more specific type depending on what action we want to dispatch.
//    We can then do the same in our reducers to catch those specific actions.

// Api Request States

export default {
  REQUEST: "REQUEST",
  FAILURE: "FAILURE",
  SUCCESS: "SUCCESS",

  requestTypeModifier: function(type) {
    return `${type}:${REQUEST}`
  },
  successTypeModifier: function(type) {
    return `${type}:${SUCCESS}`
  },
  failureTypeModifier: function(type) {
    return `${type}:${FAILURE}`
  }
}
