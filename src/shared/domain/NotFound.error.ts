import { ValueObject } from "./valueObject"

export class NotFoundError<TEntity> extends Error {
  constructor(id: ValueObject | Array<ValueObject>, entityClass: new (...args: any[]) => TEntity) {
    const idString = Array.isArray(id) ? id.map(id => id.toString()).join(', ') : id.toString()
    super(`${entityClass.constructor.name} not found using id: ${idString}`)
    this.name = 'NotFoundError'
  }
}
