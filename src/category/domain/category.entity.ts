import { Entity } from "../../shared/domain/entity"
import { EntityValidationError } from "../../shared/domain/validators/validation.error"
import { Uuid } from "../../shared/domain/valueObjects/uuid.vo"
import { Nullable } from "../../types/utils"
import { CategoryValidatorFactory } from "./category.validator"

export interface CategoryConstructorProps {
  categoryId?: Uuid
  name: string
  description?: Nullable<string>
  isActive?: boolean
  createdAt?: Date
}

export type NewCategoryProps = Pick<
  CategoryConstructorProps,
  | 'name'
  | 'description'
  | 'isActive'
>

export class Category extends Entity{
  categoryId: Uuid
  name: string
  description: Nullable<string>
  isActive: boolean
  createdAt: Date

  constructor(props: CategoryConstructorProps){
    super()
    this.categoryId = props.categoryId ?? new Uuid()
    this.name = props.name
    this.description = props.description ?? null
    this.isActive = props.isActive ?? true
    this.createdAt = props.createdAt ?? new Date()
  }

  get entityId(): Uuid {
    return this.categoryId
  }

  // factory
  // domain events
  // validation and business logic
  static create(props: NewCategoryProps){
    const category = new Category(props) 
    Category.validate(category)
    return category
  }

  rename(newName: string){
    this.name = newName
    Category.validate(this)
  }

  changeDescription(newDescription: string){
    this.description = newDescription
    Category.validate(this)
  }

  update(newName: string, newDescription: string){
    this.name = newName 
    this.description = newDescription
    Category.validate(this)
  }

  activate(){
    this.isActive = true
  }

  deactivate(){
    this.isActive = false
  }

  static validate(category: Category){
    const validator = CategoryValidatorFactory.create()
    if(!validator.validate(category) && validator.errors){
      throw new EntityValidationError(validator.errors)
    }
  }

  toJSON() {
    return {
      categoryId: this.categoryId.id,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt
    }
  }
}
