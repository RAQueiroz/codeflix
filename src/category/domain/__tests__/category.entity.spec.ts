import { before } from "lodash"
import { Uuid } from "../../../shared/domain/valueObjects/uuid.vo"
import { Category } from "../category.entity"

const defaultCategory = {
  categoryId: new Uuid(),
  name: 'Documentary',
  description: 'A fake category',
  isActive: true,
  createdAt: new Date()
} 

describe('Category', () => {
  let validateSpy: jest.SpyInstance
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate') 
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  afterAll(() => {
    jest.resetAllMocks()
  })
  describe('creates a new instance', () => {
    it('creates a partial Category instance with the least amount of data', () => {
      const name = 'Movie'
      const category = new Category({ name })

      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe(name)
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
    })
    it('creates a complete Category instance with all the data', () => {
      const category = new Category(defaultCategory)

      expect(category.categoryId).toBe(defaultCategory.categoryId)
      expect(category.name).toBe(defaultCategory.name)
      expect(category.description).toBe(defaultCategory.description)
      expect(category.isActive).toBe(defaultCategory.isActive)
      expect(category.createdAt).toBe(defaultCategory.createdAt)
    })
  })
  describe('creates a new Category', () => {
    it('creates a Category with the least amount of data', () => {
      const name = 'Movie'
      const category = Category.create({ name })

      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe(name)
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
    it('creates a Category with all the data', () => {
      const category = Category.create(defaultCategory)

      expect(category.categoryId).toBe(defaultCategory.categoryId)
      expect(category.name).toBe(defaultCategory.name)
      expect(category.description).toBe(defaultCategory.description)
      expect(category.isActive).toBe(defaultCategory.isActive)
      expect(category.createdAt).toBe(defaultCategory.createdAt)
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
  })
  describe('Category id', () => {
    test.each([
      { categoryId: null },
      { categoryId: undefined },
      { categoryId: new Uuid() }
    ])('categoryId = j%', ({ categoryId }) => {
        const category = new Category(
          { categoryId: categoryId as any, name: 'Movie'}
        )
        expect(category.categoryId).toBeInstanceOf(Uuid)
      })
  })
  describe('Category methods', () => {
    it('renames an existing Category', () => {
      const newCategoryName = 'Mockumentary' 
      const category = Category.create(defaultCategory)
      category.rename(newCategoryName)
      expect(category.name).toBe(newCategoryName)
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })
    it('changes the Category description', () => {
      const newCategoryDescription = 'A better description' 
      const category = Category.create(defaultCategory)
      category.changeDescription(newCategoryDescription)
      expect(category.description).toBe(newCategoryDescription)
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })
    it('activates a Category', () => {
      const category = Category.create({...defaultCategory, isActive: false})
      category.activate()
      expect(category.isActive).toBe(true)
    })
    it('deactivates a Category', () => {
      const category = Category.create(defaultCategory)
      category.deactivate()
      expect(category.isActive).toBe(false)
    })
    it('updates a category', () => {
      const category = Category.create(defaultCategory)
      category.update('Anime', 'Animations based on mangas')
    })
  })

})


