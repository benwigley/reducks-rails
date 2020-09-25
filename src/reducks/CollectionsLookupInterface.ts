import Collection from "./CollectionInterface"

export default interface CollectionsLookup {
  users?: Collection,
  // etc...
  // This will be compiled by the time it's actually run so
  // we don't have to list every single type of collection here.
}
