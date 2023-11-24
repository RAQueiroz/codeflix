import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category.sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/valueObjects/uuid.vo";
import { NotFoundError } from "../../../../../shared/domain/NotFound.error";
import { CategorySearchParams, CategorySearchResults } from "../../../../domain/category.repository";
import { CategoryModelMapper } from "../categoryModelMapper";
import { setupSequelize } from "../../../../../shared/infra/testing/databaseSetup";

describe('Category Sequelize Repository Integration Tests', () => {
  setupSequelize({ models: [CategoryModel]})
  let repository: CategorySequelizeRepository
  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  });

  it('inserts and retrieves a category ', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    const entity = await repository.findById(category.categoryId) 
    expect(entity.toJSON()).toStrictEqual(category.toJSON())
  })
  
  it('returns null if no category was found', async () => {
    let entity = await repository.findById(new Uuid()) 
    expect(entity).toBeNull()
  })
  it('inserts and retrieves a bulk of categories', async () => {
    const categories = Category.fake().theCategories(4).build()
    await repository.bulkInsert(categories)
    const entities = await repository.findAll()
    expect(entities).toStrictEqual(categories)
  })
  it('udpates a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    category.rename('Test')
    await repository.update(category)
    const entity = await repository.findById(category.categoryId)
    expect(entity.toJSON()).toStrictEqual(category.toJSON())
  })
  it('throws an error if cannot find a category to update', async () => {
    const category = Category.fake().aCategory().build()
    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.categoryId, Category),
    );
  })
  it('deletes a category', async () => {
    const category = Category.fake().aCategory().build()
    await repository.insert(category)
    await repository.delete(category.categoryId)
    const entity = await repository.findById(category.categoryId)
    expect(entity).toBeNull()
  })
  it('throws an error if cannot find a category to delete', async () => {
    const uuid = new Uuid()
    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid, Category),
    );
  })
  describe("search method tests", () => {
    it("should only apply pagination when other params are null", async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName("Movie")
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");

      const searchOutput = await repository.search(new CategorySearchParams());
      expect(searchOutput).toBeInstanceOf(CategorySearchResults);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.categoryId).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: "Movie",
          description: null,
          isActive: true,
          createdAt: createdAt,
        })
      );
    });

      it("should order by createdAt DESC when search params are null", async () => {
        const createdAt = new Date();
        const categories = Category.fake()
          .theCategories(16)
          .withName((index) => `Movie ${index}`)
          .withDescription(null)
          .withCreatedAt((index) => new Date(createdAt.getTime() + index))
          .build();
        const searchOutput = await repository.search(new CategorySearchParams());
        const items = searchOutput.items;
        [...items].reverse().forEach((_, index) => {
          expect(`Movie ${index}`).toBe(`${categories[index + 1].name}`);
        });
      });

      it("should apply paginate and filter", async () => {
        const categories = [
          Category.fake()
            .aCategory()
            .withName("test")
            .withCreatedAt(new Date(new Date().getTime() + 5000))
            .build(),
          Category.fake()
            .aCategory()
            .withName("a")
            .withCreatedAt(new Date(new Date().getTime() + 4000))
            .build(),
          Category.fake()
            .aCategory()
            .withName("TEST")
            .withCreatedAt(new Date(new Date().getTime() + 3000))
            .build(),
          Category.fake()
            .aCategory()
            .withName("TeSt")
            .withCreatedAt(new Date(new Date().getTime() + 1000))
            .build(),
        ];

        await repository.bulkInsert(categories);

        let searchOutput = await repository.search(
          new CategorySearchParams({
            page: 1,
            perPage: 2,
            filter: "TEST",
          })
        );
        expect(searchOutput.toJSON(true)).toMatchObject(
          new CategorySearchResults({
            items: [categories[0], categories[2]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }).toJSON(true)
        );

        searchOutput = await repository.search(
          new CategorySearchParams({
            page: 2,
            perPage: 2,
            filter: "TEST",
          })
        );
        expect(searchOutput.toJSON(true)).toMatchObject(
          new CategorySearchResults({
            items: [categories[3]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }).toJSON(true)
        );
      });

      it("should apply paginate and sort", async () => {
        expect(repository.sortableFields).toStrictEqual(["name", "createdAt"]);

        const categories = [
          Category.fake().aCategory().withName("b").build(),
          Category.fake().aCategory().withName("a").build(),
          Category.fake().aCategory().withName("d").build(),
          Category.fake().aCategory().withName("e").build(),
          Category.fake().aCategory().withName("c").build(),
        ];
        await repository.bulkInsert(categories);

        const arrange = [
          {
            params: new CategorySearchParams({
              page: 1,
              perPage: 2,
              sort: "name",
            }),
            result: new CategorySearchResults({
              items: [categories[1], categories[0]],
              total: 5,
              currentPage: 1,
              perPage: 2,
            }),
          },
          {
            params: new CategorySearchParams({
              page: 2,
              perPage: 2,
              sort: "name",
            }),
            result: new CategorySearchResults({
              items: [categories[4], categories[2]],
              total: 5,
              currentPage: 2,
              perPage: 2,
            }),
          },
          {
            params: new CategorySearchParams({
              page: 1,
              perPage: 2,
              sort: "name",
              sortDir: "desc",
            }),
            result: new CategorySearchResults({
              items: [categories[3], categories[2]],
              total: 5,
              currentPage: 1,
              perPage: 2,
            }),
          },
          {
            params: new CategorySearchParams({
              page: 2,
              perPage: 2,
              sort: "name",
              sortDir: "desc",
            }),
            result: new CategorySearchResults({
              items: [categories[4], categories[0]],
              total: 5,
              currentPage: 2,
              perPage: 2,
            }),
          },
        ];

        for (const i of arrange) {
          const result = await repository.search(i.params);
          expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
        }
      });

      describe("should search using filter, sort and paginate", () => {
        const categories = [
          Category.fake().aCategory().withName("test").build(),
          Category.fake().aCategory().withName("a").build(),
          Category.fake().aCategory().withName("TEST").build(),
          Category.fake().aCategory().withName("e").build(),
          Category.fake().aCategory().withName("TeSt").build(),
        ];

        const arrange = [
          {
            searchParams: new CategorySearchParams({
              page: 1,
              perPage: 2,
              sort: "name",
              filter: "TEST",
            }),
            searchResults: new CategorySearchResults({
              items: [categories[2], categories[4]],
              total: 3,
              currentPage: 1,
              perPage: 2,
            }),
          },
          {
            searchParams: new CategorySearchParams({
              page: 2,
              perPage: 2,
              sort: "name",
              filter: "TEST",
            }),
            searchResults: new CategorySearchResults({
              items: [categories[0]],
              total: 3,
              currentPage: 2,
              perPage: 2,
            }),
          },
        ];

        beforeEach(async () => {
          await repository.bulkInsert(categories);
        });

        test.each(arrange)(
          "when value is $search_params",
          async ({ searchParams, searchResults }) => {
            const result = await repository.search(searchParams);
            expect(result.toJSON(true)).toMatchObject(searchResults.toJSON(true));
          }
        );
      });
    });
})
