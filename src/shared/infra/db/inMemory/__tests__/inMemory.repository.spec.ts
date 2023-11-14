import { NotFoundError } from "../../../../domain/NotFound.error";
import { Entity } from "../../../../domain/entity";
import { Uuid } from "../../../../domain/valueObjects/uuid.vo";
import { InMemoryRepository } from "../inMemory.repository";

interface EntityStubProps {
  entityId?: Uuid
  name: string 
  price: number
}

class EntityStub extends Entity {
  entityId: Uuid
  name: string
  price: number;

  constructor({ entityId, name, price }: EntityStubProps){
    super()
    this.entityId = entityId ?? new Uuid()
    this.name = name
    this.price = price
  } 
  
  toJSON() {
    return {
      entityId: this.entityId,
      name: this.name,
      price: this.price
    }
  }

  
}

class InMemoryRepositoryStub extends InMemoryRepository<EntityStub> {
  getEntity(): new (...args: any[]) => EntityStub {
    return EntityStub
  }
}

describe('InMemoryRepository', () => {
  let repo: InMemoryRepositoryStub
  beforeEach(() => repo = new InMemoryRepositoryStub())

  it('inserts a new Entity', async () => {
    const entity = new EntityStub({ name: 'Test', price: 100 }) 
    
    await repo.insert(entity)
    
    expect(repo.items[0]).toStrictEqual(entity)
    expect(await repo.find(entity.entityId)).toStrictEqual(entity)
  })
  it('bulk inserts entities', async () => {
    const entity1 = new EntityStub({ name: 'Test', price: 100 }) 
    const entity2 = new EntityStub({ name: 'Test2', price: 200 }) 
    
    await repo.bulkInsert([entity1, entity2])
    
    expect(repo.items).toStrictEqual([entity1, entity2])
    expect(await repo.findAll()).toStrictEqual([entity1, entity2])
  })
  it('deletes an entity', async () => {
    const entity1 = new EntityStub({ name: 'Test', price: 100 }) 
    const entity2 = new EntityStub({ name: 'Test2', price: 200 }) 
    
    await repo.bulkInsert([entity1, entity2])
    expect(await repo.findAll()).toStrictEqual([entity1, entity2])

    await repo.delete(entity1.entityId)
    expect(await repo.findAll()).toStrictEqual([entity2])
  })
  it('updates an entity', async () => {
    const entity1 = new EntityStub({ name: 'Test', price: 100 }) 
    
    await repo.insert(entity1)
    expect(await repo.findAll()).toStrictEqual([entity1])

    const entity2 = new EntityStub({ entityId: entity1.entityId, name: 'Test2', price: 200 })

    await repo.update(entity2)

    expect(await repo.findAll()).toStrictEqual([entity2])
  })
  it('throws an error when updating an item that doesnt exist', async () => {
    const entity = new EntityStub({ name: 'Test', price: 100 })

    await expect(repo.update(entity)).rejects.toThrow(new NotFoundError(entity.entityId, EntityStub))
  })
  it('throws an error when deleting an item that doesnt exist', async () => {
    const entityId = new Uuid()

    await expect(repo.delete(entityId)).rejects.toThrow(new NotFoundError(entityId, EntityStub))
  })
})
