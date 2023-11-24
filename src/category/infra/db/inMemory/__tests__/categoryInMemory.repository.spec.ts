import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../categoryInMemory.repository";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));
  it("should not filter items when filter object is null", async () => {
    const items = [Category.fake().aCategory().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFiltering"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFiltering"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const createdAt = new Date();

    const items = [
      Category.fake().aCategory().withCreatedAt(createdAt).build(),
      Category.fake().aCategory().withCreatedAt(new Date(createdAt.getTime() + 100)).build(),
      Category.fake().aCategory().withCreatedAt(new Date(createdAt.getTime() + 200)).build(),
    ];

    const itemsSorted = await repository["applySorting"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      Category.fake().aCategory().withName('c').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('a').build(),
    ];

    let itemsSorted = await repository["applySorting"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySorting"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});