import { SortDirection } from "../../../../shared/domain/repository/searchParams";
import { SearchableInMemoryRepository } from "../../../../shared/infra/db/inMemory/searchableInMemory.repository";
import { Category } from "../../../domain/category.entity";

export class CategoryInMemoryRepository extends SearchableInMemoryRepository<Category> {
  
  sortableFields = ['name', 'createdAt']
  
  protected async applyFiltering(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase())
      );
    });
  }
  
  protected applySorting(
    items: Category[], sort: string, sortDir: SortDirection 
  ): Category[] {
    return sort
      ? super.applySorting(items, sort, sortDir) 
      : super.applySorting(items, 'createdAt', 'desc')
  }
  
  getEntity(): new (...args: any[]) => Category {
    return Category
  }
  
}
