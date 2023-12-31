import { FieldsErrors } from "./src/shared/domain/validators/validatorFields.interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R
    }
  }
}
