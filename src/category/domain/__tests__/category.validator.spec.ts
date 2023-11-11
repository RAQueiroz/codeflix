import { Category } from "../category.entity"

describe('Category validation', () => {
  describe('create method', () => {
    describe('name field', () => {
      it('throws an exception for a null name', () => {
        expect(
          // @ts-expect-error
          () => Category.create({ name: null })
        ).containsErrorMessages({
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters"
            ]
        })
      }) 
      it('throws an exception for an empty name', () => {
        expect(
          () => Category.create({ name: '' })
        ).containsErrorMessages({
            name: [
              "name should not be empty",
            ]
        })
      }) 
      it('throws an exception for a larger than expected name', () => {
        expect(
          () => Category.create({ name: 'a'.repeat(256) })
        ).containsErrorMessages({
            name: [
              "name must be shorter than or equal to 255 characters"
            ]
        })
      }) 
      it('throws an exception for non string values', () => {
        expect(
          // @ts-expect-error
          () => Category.create({ name: 2 })
        ).containsErrorMessages({
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters"
            ]
        })
      }) 
    })
    describe('description field', () => {
      it('throws an exception for non string values', () => {
        expect(
          // @ts-expect-error
          () => Category.create({ description: 2 })
        ).containsErrorMessages({
            description: [
              "description must be a string",
            ]
        })
      }) 
    })
    describe('isActive field', () => {
      it('throws an exception for a non boolean value', () => {
        expect(
          // @ts-expect-error
          () => Category.create({ isActive: 2 })
        ).containsErrorMessages({
            isActive: [
              "isActive must be a boolean value",
            ]
        })
      }) 
    })
  })
  describe('rename method', () => {
    it('throws an exception for a null name', () => {
      const category = Category.create({ name: 'Movie'})
      expect(
        // @ts-expect-error
        () => category.rename(null)
      ).containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ]
      })
    }) 
    it('throws an exception for an empty name', () => {
      const category = Category.create({ name: 'Movie'})
      expect(
        () => category.rename('')
      ).containsErrorMessages({
          name: [
            "name should not be empty",
          ]
      })
    }) 
    it('throws an exception for a larger than expected name', () => {
      const category = Category.create({ name: 'Movie'})
      expect(
        () => category.rename('a'.repeat(256))
      ).containsErrorMessages({
          name: [
            "name must be shorter than or equal to 255 characters"
          ]
      })
    }) 
    it('throws an exception for non string values', () => {
      const category = Category.create({ name: 'Movie'})
      expect(
        // @ts-expect-error
        () => category.rename(2)
      ).containsErrorMessages({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ]
      })
    }) 
  })
  describe('changeDescription method', () => {
    it('throws an exception for non string values', () => {
      const category = Category.create({ name: 'Movie'})
      expect(
        // @ts-expect-error
        () => category.changeDescription(2)
      ).containsErrorMessages({
          description: [
            "description must be a string",
          ]
      })
    }) 
  })
  describe('update method', () => {
    it('throws an exception for non string values', () => {
      const category = Category.create({ name: 'Movie', description: 'Only the best of the seventh art'})
      expect(
        // @ts-expect-error
        () => category.update(null, 7)
      ).containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ],
          description: [
            "description must be a string",
          ]
      })
    }) 
  })
})
