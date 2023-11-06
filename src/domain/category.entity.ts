import { Nullable } from "../types/utils"

export interface CategoryConstructorProps {
  categoryId?: string
  name: string
  description?: Nullable<string>
  isActive?: boolean
  createdAt?: Date
}

export type NewCategoryProps = Pick<CategoryConstructorProps, 'name' | 'description' | 'isActive'>

export class Category {
  categoryId: string
  name: string
  description: Nullable<string>
  isActive: boolean
  createdAt: Date

  constructor(props: CategoryConstructorProps){
    this.categoryId = props.categoryId ?? ''
    this.name = props.name
    this.description = props.description ?? null
    this.isActive = props.isActive ?? true
    this.createdAt = props.createdAt ?? new Date()
  }

  // factory
  // domain events
  // validation and business logic
  create(props: NewCategoryProps){
    return new Category(props) 
  }

  rename(newName: string){
    this.name = newName
  }

  changeDescription(newDescription: string){
    this.description = newDescription
  }

  activate(){
    this.isActive = true
  }

  deactivate(){
    this.isActive = false
  }

  toJSON() {
    return {
      categoryId: this.categoryId,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt
    }
  }
}
