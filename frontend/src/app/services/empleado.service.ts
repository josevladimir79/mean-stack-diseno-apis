import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empleado } from '../models/empleado';
import { environment } from '../../environments/environment';
import { tap, catchError, Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  URL_API = `${environment.apiURL}/empleados`;

  empleadosSubject = new BehaviorSubject<Empleado[]>([]);
  empleadoSelected = new BehaviorSubject<Empleado | null>(null);

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.URL_API).pipe(
      tap((res: any) => {
        if (res.success) {
          this.empleadosSubject.next(res.data);
        } else {
          handleError('Ocurrio un error al cargar los empleados.', null);
        }
      }),
      catchError(() =>
        handleError<Observable<Empleado[]>>(
          'Ocurrio un error al cargar los empleados.',
          of([]),
        ),
      ),
    );
  }
  createEmpleado(empleado: Empleado) {
    return this.http.post(this.URL_API, empleado).pipe(
      tap((res: any) => {
        if (res.success) {
          this.empleadosSubject.next([
            ...this.empleadosSubject.value,
            res.data,
          ]);
          alert(res.message);
        } else {
          handleError(res.message, null);
        }
      }),
    );
  }

  updateEmpleado(id: string, empleado: Empleado) {
    return this.http.put(`${this.URL_API}/${id}`, empleado).pipe(
      tap((res: any) => {
        if (res.success) {
          this.empleadosSubject.next(
            this.empleadosSubject.value.map((e) =>
              e._id === id ? res.data : e,
            ),
          );
          alert(res.message);
        } else {
          handleError(res.message, null);
        }
      }),
      catchError(() =>
        handleError<Observable<void>>(
          'Ocurrio un error al actualizar el empleado.',
          of(undefined),
        ),
      ),
    );
  }

  deleteEmpleado(id: string): Observable<void> | void {
    if (confirm('¿Esta seguro que desea eliminar el empleado?')) {
      return this.http.delete(`${this.URL_API}/${id}`).pipe(
        tap((res: any) => {
          if (res.success) {
            this.empleadosSubject.next(
              this.empleadosSubject.value.filter((e) => e._id !== id),
            );
            alert(res.message);
          } else {
            handleError(res.message, null);
          }
        }),
        catchError(() =>
          handleError<Observable<void>>(
            'Ocurrio un error al eliminar el empleado.',
            of(undefined),
          ),
        ),
      );
    }
  }

  selectEmpleado(empleado: Empleado) {
    this.empleadoSelected.next(empleado);
  }
}

function handleError<T>(errorMessage: string, returning: T): T {
  alert(errorMessage);
  return returning;
}
