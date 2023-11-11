import { ValueObject } from "../valueObject"

class StringValueObject extends ValueObject {
  constructor(readonly value: string){
    super()
  }  
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value1: string, readonly value2: number){
    super()
  }  
}

describe('ValueObject', () => {
  it('is equal', () => {
    const valueObject1 = new StringValueObject('test')
    const valueObject2 = new StringValueObject('test')
    expect(valueObject1.equals(valueObject2)).toBe(true)
    
    const complexValueObject1 = new ComplexValueObject('test', 2)
    const complexValueObject2 = new ComplexValueObject('test', 1)
    expect(complexValueObject1.equals(complexValueObject2)).toBe(false)
  })
})
