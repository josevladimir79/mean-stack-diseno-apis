import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMAIL_PATTERN, matches } from '../../validators/form.validators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      matches(/\S/, 'required'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_PATTERN),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      matches(/[0-9]/, 'number'),
      matches(/[A-Z]/, 'uppercase'),
    ]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  signup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.authService.signup(this.signupForm.value).subscribe((res: any) => {
      if (res?.success) {
        this.router.navigate(['/login']);
      }
    });
  }

  hasFormError(controlName: string) {
    return (
      this.signupForm.get(controlName)?.invalid &&
      this.signupForm.get(controlName)?.touched
    );
  }
  getErrorMessage(controlName: string) {
    const control = this.signupForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('pattern')) {
      return 'El email no es válido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    if (control?.hasError('number')) {
      return 'La contraseña debe tener al menos un número';
    }
    if (control?.hasError('uppercase')) {
      return 'La contraseña debe tener al menos una mayúscula';
    }
    return '';
  }
}
