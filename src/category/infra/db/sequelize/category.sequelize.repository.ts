import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/NotFound.error';
import { ValueObject } from '../../../../shared/domain/valueObject';
import { Uuid } from '../../../../shared/domain/valueObjects/uuid.vo';
import { Nullable } from '../../../../types/utils';
import { Category } from '../../../domain/category.entity';
import { CategoryRepository, CategorySearchParams, CategorySearchResults } from '../../../domain/category.repository'
import { CategoryModel } from './category.model';
import { CategoryModelMapper } from './categoryModelMapper';

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields = ['name', 'createdAt']

  constructor(private categoryModel: typeof CategoryModel){}
  
  async search(props: CategorySearchParams): Promise<CategorySearchResults> {
    const offset = (props.page - 1) * props.perPage
    const limit = props.perPage
    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: { name: { [Op.like]: `%${props.filter}%` }}
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sortDir]]}
        : { order: [['createdAt', 'desc']]}
      ),
      offset,
      limit
    })
    return new CategorySearchResults({
      items: models.map(CategoryModelMapper.toEntity),
      currentPage: props.page,
      perPage: props.perPage,
      total: count
    })
  }
  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create(
      CategoryModelMapper.toModel(entity)
    )
  }
  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map(CategoryModelMapper.toModel)
    )
  }
  async update(entity: Category): Promise<void> {
    const category = await this._findById(entity.categoryId) 
    if(!category){
      throw new NotFoundError(entity.categoryId, this.getEntity())
    }
    await this.categoryModel.update(
      CategoryModelMapper.toModel(entity),
      { where: { categoryId: entity.categoryId.id } }
    ) 
  }
  async delete(entityId: ValueObject): Promise<void> {
    const category = await this._findById(entityId) 
    if(!category){
      throw new NotFoundError(entityId, this.getEntity())
    }
    await this.categoryModel.destroy({ where: { categoryId: entityId.toString() } })
  }
  
  async findById(entityId: ValueObject): Promise<Nullable<Category>> {
    const model = await this._findById(entityId)
    if(!model){
      return null
    }
    return CategoryModelMapper.toEntity(model)
  }
  
  private async _findById(entityId: ValueObject){
    return await this.categoryModel.findByPk(entityId.toString())
  }
  
  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll()
    return models.map(CategoryModelMapper.toEntity)
  }
  getEntity(): new (...args: any[]) => Category {
    return Category
  }
}
