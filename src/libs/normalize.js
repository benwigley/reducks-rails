import normalizedMerge from './normalizedMerge'
import pluralize from 'pluralize'
import { keyBy, isArray, cloneDeep, unionWith, isObject, isNil } from 'lodash'
import logger from './logger'

let count


// Check the schema for any nested collections that we haven't been
// normalized/processed by checking the mainSchema and merging them in.
// This allows us to specify only one level deep of nesting in our mainSchema
function hydrateSchema(schema, mainSchema) {
  if (mainSchema[schema.collection] && mainSchema[schema.collection].nested) {
    // if (!isArray(schemaForCollection)) {
    //   schemaForCollection = [schemaForCollection]
    // }
    // `unionWith` prevents duplicates in the array
    schema.nested = unionWith(schema.nested, mainSchema[schema.collection].nested, (schemaA, schemaB) => {
      return schemaA.key === schemaB.key
    })
    return schema
  }
  return schema
}

// Recursive functon to deep-process nested objects into a normalized format of { entities, ids }
function processNestedCollections(withSchema, entitiesArray, baseCollectionsLookup, mainSchema, hardFail = false) {
  count += 1
  let schema = cloneDeep(withSchema)
  if (!schema.collection) throw new Error(`Normalize.collection must exist`)
  if (!schema.key) schema.key = schema.collection
  if (!isArray(schema.nested)) {
    schema.nested = [schema.nested]
  }
  hydrateSchema(schema, mainSchema)
  schema.nested.forEach((nestedSchema) => {
    if (!baseCollectionsLookup[nestedSchema.collection]) baseCollectionsLookup[nestedSchema.collection] = {}
    for (let index = 0; index < entitiesArray.length; index++) {
      // Soft fallback to ignore the schema
      if (isNil(entitiesArray[index][nestedSchema.key])) {
        if (hardFail) {
          throw new Error(`Normalize: Nested item '${nestedSchema.key}' doesn't exist`)
        } else {
          // Set a default empty object or array for the item, as well as an empty id array
          entitiesArray[index][nestedSchema.key] = pluralize.isPlural(nestedSchema.key) ? [] : {}
          entitiesArray[index][`${pluralize.singular(nestedSchema.key)}Ids`] = []
        }
      } else {
        const isNestedItemAnArray = isArray(entitiesArray[index][nestedSchema.key])
        const nestedSchemasArray = isNestedItemAnArray ? entitiesArray[index][nestedSchema.key] : [entitiesArray[index][nestedSchema.key]]

        // Recursive Call For Deeply Nested Entities
        // If there is another nested item below this one, then we will need to process that too, and so on.
        hydrateSchema(nestedSchema, mainSchema)
        if (!nestedSchema.key) nestedSchema.key = nestedSchema.collection
        if (nestedSchema.nested) {
          // We process the most deeply nested relations first by calling this function before processing each nested item.
          processNestedCollections(cloneDeep(nestedSchema), nestedSchemasArray, baseCollectionsLookup, mainSchema)
        }

        // Update the base collection with any new items found
        baseCollectionsLookup[nestedSchema.collection] = normalizedMerge(baseCollectionsLookup[nestedSchema.collection], {
          entities: keyBy(nestedSchemasArray, 'id'),
          ids: nestedSchemasArray.map(e => e.id)
        }, false)

        // Clean Up
        // Replace the nested collection with a list of ids
        if (isNestedItemAnArray) {
          entitiesArray[index][`${pluralize.singular(nestedSchema.key)}Ids`] = nestedSchemasArray.map(e => e.id)
        }
        entitiesArray[index][`${nestedSchema.key}Fetched`] = true
        delete entitiesArray[index][nestedSchema.key]
      }
    } // end for loop
  })
}

// Public utility function
// This can handle the baseEntitiesArray being a baseEntity"Object" too.
export default function normalize(baseEntitiesArray, baseSchema, mainSchema) {
  if (typeof baseEntitiesArray == 'undefined') {
    throw new TypeError(`#normalize expected first argument to be type Array|Object, but got type: ${typeof baseEntitiesArray}`)
  }
  if (!isObject(baseSchema)) {
    throw new TypeError(`#normalize expected second argument to be an Object, but got type: ${typeof baseSchema}`)
  }
  if (typeof baseSchema.collection !== 'string') {
    throw new TypeError(`#normalize expected second argument to be a ReducksRails:schema object, e.g. { key: 'users', collection: 'users' }`)
  }
  if (!isObject(mainSchema)) {
    throw new TypeError(`#normalize expected third argument to be an Object, but got type: ${typeof mainSchema}`)
  }
  if (typeof mainSchema[baseSchema.collection] !== 'object') {
    throw new TypeError(`#normalize expected third argument to be a ReducksRails:schema object, e.g. { key: 'users', collection: 'users' }, but schema object '${baseSchema.collection}' not found on schema`)
  }

  // For counting how many layers deep we dive (debugging only)
  count = 0

  // This is the base collection lookup, in the format:
  // { recipeItems: { entities, ids }, recipeProjects, { entities, ids }, ... }
  let baseCollectionsLookup = {}

  let clonedBaseEntitiesArray = cloneDeep(baseEntitiesArray)
  if (baseSchema.key && clonedBaseEntitiesArray[baseSchema.key]) {
    clonedBaseEntitiesArray = clonedBaseEntitiesArray[baseSchema.key]
  }
  if (!isArray(clonedBaseEntitiesArray)) {
    clonedBaseEntitiesArray = [clonedBaseEntitiesArray]
  }

  if (baseSchema.nested) {
    // logger.debug('Normalize: baseSchema.nested', baseSchema.nested)
    processNestedCollections(baseSchema, clonedBaseEntitiesArray, baseCollectionsLookup, mainSchema)
  }

  baseCollectionsLookup[baseSchema.collection] = {
    entities: keyBy(clonedBaseEntitiesArray, 'id'),
    ids: clonedBaseEntitiesArray.map(e => e.id)
  }

  logger.debug(`Normalize: Processed ${count} nested collections in collection:${baseSchema.collection}`)
  logger.debug(`Normalize: Final baseCollectionsLookup keys`, Object.keys(baseCollectionsLookup))
  return baseCollectionsLookup
}
