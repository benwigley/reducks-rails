module.exports = {

  users: {
    collection: 'users',
    nested: [{
      key: 'avatar',
      collection: 'avatars',
    }]
  },

  posts: {
    collection: 'posts',
    nested: [{
      key: 'comment',
      collection: 'comments'
    }]
  },

}
