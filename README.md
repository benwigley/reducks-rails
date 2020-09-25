# Reducks Rails

Connect your app to Rails with Redux using the Reducks methodology.


### The schema object

```javascript

const schema = {
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
  }
}

```
