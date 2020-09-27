export default {

  users: {
    collection: 'users',
    nested: [
      {
        key: 'avatar', // singular, we will look for an object not an array
        collection: 'avatars',
      },
      {
        key: 'posts',
        collection: 'posts',
      }
    ]
  },

  posts: {
    collection: 'posts',
    nested: [{
      key: 'comments',
      collection: 'comments'
    }]
  },

  comments: {
    collection: 'comments'
  },

  avatars: {
    collection: 'avatars'
  },

}
