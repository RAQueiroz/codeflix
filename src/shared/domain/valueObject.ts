import {isEqual} from '../utils/isEqual'

export abstract class ValueObject {
  public equals(vo: this) {
    // return !vo || !(vo.constructor.name !== this.constructor.name) || isEqual(vo, this)
    if(vo === null || vo === undefined) return false
    if(vo.constructor.name !== this.constructor.name) return false
    // return isEqual(vo, this)
    return JSON.stringify(vo) === JSON.stringify(this)
  }

  abstract toString(): string
}
