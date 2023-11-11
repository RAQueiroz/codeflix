import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"
import { Nullable } from "../../types/utils"
import { Category } from "./category.entity"
import { ClassValidatorFields } from "../../shared/domain/validators/classValidator.fields"

export class CategoryRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string
  
  @IsString()
  @IsOptional()
  description: Nullable<string>
  
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean

  constructor({ name, description, isActive }: Category){
    this.name = name
    this.description = description
    this.isActive = isActive
  }
}

class CategoryValidator extends ClassValidatorFields<CategoryRules> {
  validate(category: Category){
    return super.validate(new CategoryRules(category))
  }
}

export class CategoryValidatorFactory {
  static create(){
    return new CategoryValidator()
  }
}
