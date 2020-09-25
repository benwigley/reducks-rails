export default interface Schema {
  collection: string,
  key?: string,
  nested?: Array<Schema>
}
