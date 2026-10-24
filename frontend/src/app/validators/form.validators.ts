import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Misma expresión que usa z.email() en el backend
export const EMAIL_PATTERN =
  /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

// Devuelve { [errorKey]: true } cuando el valor no cumple la expresión,
// para poder tener varios patrones con mensajes distintos en un mismo campo
export function matches(pattern: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ?? '';
    return pattern.test(value) ? null : { [errorKey]: true };
  };
}
