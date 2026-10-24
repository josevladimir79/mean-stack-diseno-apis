import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';
import { tap, catchError, Observable, of } from 'rxjs';

const TOKEN_KEY = 'jwtToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  URL_USUARIOS = `${environment.apiURL}/usuarios`;
  URL_AUTH = `${environment.apiURL}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  signup(usuario: Usuario) {
    return this.http.post(this.URL_USUARIOS, usuario).pipe(
      tap((res: any) => {
        if (res.success) {
          alert(res.message);
        } else {
          handleError(res.message, null);
        }
      }),
      catchError((err: HttpErrorResponse) =>
        handleError<Observable<void>>(
          err.error?.message || 'Ocurrio un error al registrar el usuario.',
          of(undefined),
        ),
      ),
    );
  }

  login(credenciales: Pick<Usuario, 'email' | 'password'>) {
    return this.http.post(`${this.URL_AUTH}/login`, credenciales).pipe(
      tap((res: any) => {
        if (res.success) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          alert(res.message);
        } else {
          handleError(res.message, null);
        }
      }),
      catchError((err: HttpErrorResponse) =>
        handleError<Observable<void>>(
          err.error?.message || 'Ocurrio un error al iniciar sesion.',
          of(undefined),
        ),
      ),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }
}

function handleError<T>(errorMessage: string, returning: T): T {
  alert(errorMessage);
  return returning;
}
