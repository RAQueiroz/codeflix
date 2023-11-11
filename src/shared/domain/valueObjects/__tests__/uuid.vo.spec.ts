import { InvalidUuidError, Uuid } from "../uuid.vo"
import { v4 as uuid } from 'uuid'

describe('Uuid', () => {
  let validateSpy: jest.SpyInstance
  beforeEach(() => {
    validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')
  })
  afterEach(() => jest.restoreAllMocks())
  it('throws an error when invalid', () => {
    expect(
      () => new Uuid('teste')
    ).toThrow(InvalidUuidError) 
    expect(validateSpy).toHaveBeenCalled()
  })
  it('creates a valid uuid', () => {
    expect(
      () => new Uuid()
    ).not.toThrow()
    expect(validateSpy).toHaveBeenCalled()
  })
  it('accepts a valid uuid', () => {
    const expected = uuid()
    expect(new Uuid(expected).id).toBe(expected)
    expect(validateSpy).toHaveBeenCalled()
  })
}) 
