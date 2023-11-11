import { ValueObject } from "./valueObject";

export abstract class Entity{
  abstract get entityId(): ValueObject
  abstract toJSON(): any
}
