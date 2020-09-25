export default interface Collection {
  entities: Object,
  ids: Array<number | string> // ids array can contains `tmpIds` which are strigns
}
