import { Nullable } from "../../../../types/utils";
import { NotFoundError } from "../../../domain/NotFound.error";
import { Entity } from "../../../domain/entity";
import { ValueObject } from "../../../domain/valueObject";
import { Repository } from "../../../domain/repository/repository.interface";

export abstract class InMemoryRepository<TEntity extends Entity> implements Repository<TEntity>{
  items: Array<TEntity> = []
  
  async insert(entity: TEntity): Promise<void> {
    this.items.push(entity)
  }
  async bulkInsert(entities: TEntity[]): Promise<void> {
    this.items.push(...entities)
  }
  
  async update(entity: TEntity): Promise<void> {
    let updated = false
    this.items = this.items.map((item) => {
      if(item.entityId.equals(entity.entityId)){
        updated = true
        return entity
      }
      return item
    })

    if(!updated){
      throw new NotFoundError(entity.entityId, this.getEntity())
    }
  }
  
  async delete(entityId: ValueObject): Promise<void> {
    const initialItemsLength = this.items.length
    this.items = this.items.filter(item => !item.entityId.equals(entityId))
    if(initialItemsLength === this.items.length){
      throw new NotFoundError(entityId, this.getEntity()) 
    }
  }
  
  find(entityId: ValueObject): Promise<Nullable<TEntity>> {
    const entity = this.items.find(item => item.entityId.equals(entityId))
    if(entity){
      return Promise.resolve(entity)
    }
    return Promise.resolve(null)
  }
  findAll(): Promise<TEntity[]> {
    return Promise.resolve(this.items)
  }
  
  abstract getEntity(): new (...args: any[]) => TEntity
}
