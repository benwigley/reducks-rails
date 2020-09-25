import createStore from "./createStore"
import { fetchPosts } from "./reducks/posts"

const initialState = {}

const store = createStore(initialState)

store.dispatch(fetchPosts()).then(function(res) {
  console.log('res', res);
})
