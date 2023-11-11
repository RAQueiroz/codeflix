import { ValueObject } from "../valueObject";
import { v4 as uuid, validate } from 'uuid'

export class Uuid extends ValueObject{
  readonly id: string
  constructor(id?: string){
    super()
    this.id = id || uuid()
    this.validate()
  }

  validate(){
    if(!validate(this.id)){
      throw new InvalidUuidError()
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(message: string = 'Must be a valid uuid'){
    super(message)
    this.name = 'InvalidUuidError'
  }
}
