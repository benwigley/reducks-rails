# Reducks Rails

Connect your app to Rails with Redux using the Reducks methodology.


### The schema object

```javascript

const schema = {
  users: {
    collection: 'users',      // 'collection' required for base collections
    nested: [{
      key: 'avatar',          // 'key' is required for nested schemas only
      collection: 'avatars',  // 'collection' is required for nested schemas
    }]
  },
  posts: {
    collection: 'posts',
    nested: [{
      key: 'comment',
      collection: 'comments'
    }]
  }
}

```
