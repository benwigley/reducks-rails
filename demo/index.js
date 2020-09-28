import createStore from "./createStore"
import postsCollection from "./reducks/posts"

const initialState = {}

const store = createStore(initialState)

store.dispatch(postsCollection.index()).then(function(res) {
  console.log('Fetching of posts finished');
})
