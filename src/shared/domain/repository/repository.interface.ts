import { Nullable } from "../../../types/utils";
import { Entity } from "../entity";
import { ValueObject } from "../valueObject";
import { SearchParams } from "./searchParams";
import { SearchResult } from "./searchResult";

export interface Repository<TEntity extends Entity> {
  insert(entity: TEntity): Promise<void> 
  bulkInsert(entities: Array<TEntity>): Promise<void>
  update(entity: TEntity): Promise<void>
  delete(entityId: ValueObject): Promise<void>

  findById(entityId: ValueObject): Promise<Nullable<TEntity>>
  findAll(): Promise<Array<TEntity>>

  getEntity(): new (...args: any[]) => TEntity
}

export interface SearchableRepository<TEntity extends Entity, SearchInput = SearchParams, SearchOutput = SearchResult> extends Repository<TEntity> {
  sortableFields: string[]
  
  search(props: SearchInput): Promise<SearchOutput> 
}
