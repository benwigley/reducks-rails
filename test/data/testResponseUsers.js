import { find } from 'lodash'
import testResponsePosts from './testResponsePosts'
import testResponseAvatars from './testResponseAvatars'

export default [
  {
    id: 14,
    name: "Jemima Puddleduck",
    avatar: null,
    posts: testResponsePosts.filter(p => p.userId == 14),
  },
  {
    id: 16,
    name: "Borris",
    avatar: find(testResponseAvatars, a => a.userId == 16),
    posts: testResponsePosts.filter(p => p.userId == 16),
  },
]
