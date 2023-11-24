import { SearchableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchParams } from "../../shared/domain/repository/searchParams";
import { SearchResult } from "../../shared/domain/repository/searchResult";
import { Category } from "./category.entity";

export class CategorySearchParams extends SearchParams<string>{}
export class CategorySearchResults extends SearchResult<Category>{}

export interface CategoryRepository extends SearchableRepository<
  Category,
  CategorySearchParams,
  CategorySearchResults
> {}
