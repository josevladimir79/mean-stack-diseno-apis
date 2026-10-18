import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-empleado-form',
  templateUrl: './empleado-form.component.html',
  styleUrl: './empleado-form.component.css',
})
export class EmpleadoFormComponent implements OnDestroy {
  employeeForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    cargo: new FormControl('', [Validators.required]),
    departamento: new FormControl('', [Validators.required]),
    sueldo: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  empleadoSelectedSubscription: Subscription;

  mode: 'creation' | 'edition' = 'creation';

  constructor(private empleadoService: EmpleadoService) {
    this.empleadoSelectedSubscription =
      this.empleadoService.empleadoSelected.subscribe((empleado) => {
        if (empleado) {
          this.employeeForm.setValue({
            nombre: empleado?.nombre || '',
            cargo: empleado?.cargo || '',
            departamento: empleado?.departamento || '',
            sueldo: empleado?.sueldo || '',
          });
          this.mode = 'edition';
        }
      });
  }
  ngOnDestroy() {
    this.empleadoSelectedSubscription.unsubscribe();
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      this.empleadoService.createEmpleado(this.employeeForm.value).subscribe();
      this.employeeForm.reset();
    }
  }

  hasFormError(controlName: string) {
    return (
      this.employeeForm.get(controlName)?.invalid &&
      this.employeeForm.get(controlName)?.touched
    );
  }
  getErrorMessage(controlName: string) {
    const control = this.employeeForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('min')) {
      return 'El valor debe ser mayor a 0';
    }
    return '';
  }

  updateEmployee() {
    let employeeId = this.empleadoService.empleadoSelected.value?._id;
    if (employeeId?.trim() && this.employeeForm.valid) {
      this.empleadoService
        .updateEmpleado(employeeId, this.employeeForm.value)
        .subscribe();
      this.employeeForm.reset();
      this.mode = 'creation';
    }
  }

  cancelEdit() {
    this.employeeForm.reset();
    this.mode = 'creation';
  }
}
