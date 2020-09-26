import { isObject } from 'lodash'
import ReducksBaseCollection from '../../src/reducks/ReducksBaseCollection'

class PostsController extends ReducksBaseCollection {
}

describe('ReducksBaseCollection', () => {

  describe('prototype', () => {
    it('should have an initialState property', () => {
      expect(isObject(ReducksBaseCollection.prototype.initialState)).toBe(true)
    })
  })

})
