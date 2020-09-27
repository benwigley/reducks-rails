import { filter } from 'lodash'
import testResponseComments from './testResponseComments'

export default [

  // userId 16, 1 post
  {
    id: 122,
    userId: 16,
    title: "How to Be a Duck",
    comments: filter(testResponseComments, comment => comment.postId == 122)
  },

  // userId: 14, 3 posts
  {
    id: 104,
    userId: 14,
    title: "Posting About Reducks",
    comments: []
  },
  {
    id: 121,
    userId: 14,
    title: "How to Read Ducks"
  },
  {
    id: 125,
    userId: 14,
    title: "Quack Quack",
    comments: filter(testResponseComments, comment => comment.postId == 125)
  },
]
