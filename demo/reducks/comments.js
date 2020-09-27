import { ReducksBaseCollection } from 'reducks-rails'
import mainSchema from './schema'


class Comments extends ReducksBaseCollection {

  constructor() {
    super()

    // Set required properties
    this.schema = mainSchema.comments
    this.mainSchema = mainSchema

    this.initialState = {}
  }

  // We haven't set a reducer function here because we
  // are happy to just use the basic actions defined by
  // ReducksBaseCollection; [index, show, create, update, delete]
  //
  // reducer(state, action = {}) {
  //   ...
  // }

}

export default new Comments()
