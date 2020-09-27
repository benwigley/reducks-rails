import { filter, find } from 'lodash'
import testResponsePosts from './testResponsePosts'
import testResponseAvatars from './testResponseAvatars'

export default [
  {
    id: 14,
    name: "Jemima Puddleduck",
    avatar: null,
    posts: filter(testResponsePosts, p => p.userId == 14),
  },
  {
    id: 16,
    title: "How to Read Ducks",
    avatar: find(testResponsePosts, a => a.userId == 16),
    posts: filter(testResponsePosts, p => p.userId == 16),
  },
]
