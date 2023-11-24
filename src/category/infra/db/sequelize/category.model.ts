import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Nullable } from "../../../../types/utils";

export interface CategoryModelAttributes {
  categoryId: string
  name: string
  description: Nullable<string>
  isActive: boolean
  createdAt: Date
}

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelAttributes> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare categoryId: string 
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare name: string
  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: Nullable<string>
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  declare isActive: boolean
  @Column({ type: DataType.DATE(3), allowNull: false })
  declare createdAt: Date
}
