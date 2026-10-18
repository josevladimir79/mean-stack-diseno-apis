import { Component } from '@angular/core';
import { Empleado } from '../../models/empleado';
import { BehaviorSubject } from 'rxjs';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleado-table',
  templateUrl: './empleado-table.component.html',
  styleUrl: './empleado-table.component.css',
})
export class EmpleadoTableComponent {
  empleados: BehaviorSubject<Empleado[]> =
    this.empleadoService.empleadosSubject;

  constructor(private empleadoService: EmpleadoService) {
    this.empleadoService.getEmpleados().subscribe();
  }

  edit(empleado: Empleado) {
    this.empleadoService.selectEmpleado(empleado);
  }

  delete(empleado: Empleado) {
    this.empleadoService.deleteEmpleado(empleado._id || '')?.subscribe();
  }
}
