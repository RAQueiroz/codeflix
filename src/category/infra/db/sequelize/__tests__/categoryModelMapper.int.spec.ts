import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../categoryModelMapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/valueObjects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/databaseSetup";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] })
  it("should throws error when category is invalid", () => {
    const model = CategoryModel.build({
      categoryId: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail(
        "The category is valid, but it needs to throw an EntityValidationError"
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category entity", () => {
    const createdAt = new Date();
    const model = CategoryModel.build({
      categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category({
        categoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        isActive: true,
        createdAt,
      }).toJSON()
    );
  });

  test("should convert a category entity to a category model", () => {
    const createdAt = new Date();
    const entity = new Category({
      categoryId: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
    const model = CategoryModelMapper.toModel(entity);
    expect(model).toStrictEqual({
      categoryId: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      isActive: true,
      createdAt,
    });
  });
});
