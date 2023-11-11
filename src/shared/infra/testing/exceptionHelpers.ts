import { ClassValidatorFields } from "../../domain/validators/classValidator.fields"
import { EntityValidationError } from "../../domain/validators/validation.error"
import { FieldsErrors } from "../../domain/validators/validatorFields.interface"

type Expected =
| {
    validator: ClassValidatorFields<any> 
    data: any
  }
| (() => any)

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors){
    if(typeof expected === 'function'){
      try{
        expected()
        return isValid()
      } catch(e) {
        const error = e as EntityValidationError
        return assertContainErrorMessages(error.error, received)
      }
    } else {
      const { validator, data } = expected  
      const validated = validator.validate(data)

      if(validated){
        return isValid()
      }
      return assertContainErrorMessages(validator.errors as any, received)
    }  
  }
})

function assertContainErrorMessages(expected: FieldsErrors, received: FieldsErrors){
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected)

  return isMatch
  ? isValid()
  : {
      pass: false,
      message: () =>  `The validation errors doesn't contain ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    }
}

function isValid(){
  return { pass: true, message: () => ''}
}
