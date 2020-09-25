import createStore from "./createStore"
import postsCollection from "./reducks/posts"

const initialState = {}

const store = createStore(initialState)

store.dispatch(postsCollection.fetchPosts()).then(function(res) {
  console.log('Fetching of posts finished');
})
