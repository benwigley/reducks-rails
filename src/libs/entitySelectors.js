import { filter, find, isObject, isArray } from "lodash"

function validateResource(resource) {
  if (!isObject(resource)) {
    throw new TypeError("Invalid resource object")
  }
  if (!isObject(resource.entities) || !isArray(resource.ids)) {
    throw new TypeError("Invalid resource object, should be in the format { entities: {...}, ids: [...] }")
  }
}

export const getEntitiesArray = (resource) => {
  validateResource(resource)
  return resource.ids.map(id => resource.entities[id])
}

export const where = (resource, matchAttrs) => {
  return filter(getEntitiesArray(resource), matchAttrs)
}

export const findWhere = (resource, matchAttrs) => {
  return find(getEntitiesArray(resource), matchAttrs)
}

export const entitiesMap = (resource, mapper) => {
  return getEntitiesArray(resource).map(mapper)
}

export const entitiesFilter = (resource, predicate) => {
  return filter(getEntitiesArray(resource), predicate)
}

export default {
  getEntitiesArray,
  where,
  findWhere,
  map: entitiesMap,
  filter: entitiesFilter,
}
