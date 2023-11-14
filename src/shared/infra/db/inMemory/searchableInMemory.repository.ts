import { Nullable } from "../../../../types/utils"
import { Entity } from "../../../domain/entity"
import { SearchableRepository } from "../../../domain/repository/repository.interface"
import { SearchParams, SortDirection } from "../../../domain/repository/searchParams"
import { SearchResult } from "../../../domain/repository/searchResult"
import { InMemoryRepository } from "./inMemory.repository"


export abstract class SearchableInMemoryRepository<TEntity extends Entity, Filter extends string = string> extends InMemoryRepository<TEntity> implements SearchableRepository<TEntity> {
  
  items: Array<TEntity>
  sortableFields: string[] = []
  
  async search(props: SearchParams<Filter>): Promise<SearchResult<TEntity>> {
    const filteredItems = await this.applyFiltering(this.items, props.filter)
    const sortedItems = this.applySorting(filteredItems, props.sort, props.sortDir)
    const paginatedItems = this.applyPagination(sortedItems, props.page, props.perPage)

    return new SearchResult({
      items: paginatedItems,
      total: filteredItems.length,
      currentPage: props.page,
      perPage: props.perPage
    })
  }

  protected abstract applyFiltering(items: Array<TEntity>, filter: Filter | null): Promise<Array<TEntity>>
  
  protected applySorting(
    items: Array<TEntity>,
    sort: string | null,
    sortDir: Nullable<SortDirection>,
    customGetter?: (sort: string, item: TEntity) => any
  ){
    if(!sort || !this.sortableFields.includes(sort)){
      return items
    } 
    return [...items].sort((item1, item2) => {
      const value1 = customGetter ? customGetter(sort, item1) : item1[sort as keyof TEntity] 
      const value2 = customGetter ? customGetter(sort, item2) : item2[sort as keyof TEntity] 

      if(value1 < value2){
        return sortDir === 'asc' ? -1 : 1
      }
      
      if(value1 > value2){
        return sortDir === 'asc' ? 1 : -1
      }

      return 0
    })
  }
  
  protected applyPagination(items: Array<TEntity>, page: SearchParams['page'], perPage: SearchParams['perPage']){
    const start = (page - 1) * perPage   
    const limit = start + perPage
    return items.slice(start, limit)
  }
  
}
