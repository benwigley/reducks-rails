export default {

  users: {
    collection: 'users',
    controllerPath: 'users', // optional, e.g. A collection named 'userPosts' > 'user_posts'
    nested: [{
      key: 'avatar', // singular, we will look for an object not an array
      collection: 'avatars',
    }]
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

}
