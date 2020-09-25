/**
 * This middleware will add a utility function "asyncDispatch"
 * that allows actions to be dispatched from within a reducer.
 */
const asyncDispatchMiddleware = store => next => action => {
  let syncActivityFinished = false
  let actionQueue = []

  async function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)) // flush each dispatch
    actionQueue = []
  }

  const res = next({
    ...action,

    // Adds an asyncDispatch function to the redux
    // action that can be called from inside reducers.
    // e.g. action.asyncDispatch({ type: SOME_TYPE })
    asyncDispatch: async (asyncAction) => {
      actionQueue = actionQueue.concat([asyncAction])
      if (syncActivityFinished) await flushQueue()
    }
  })

  syncActivityFinished = true
  flushQueue()

  return res
}

export default asyncDispatchMiddleware
