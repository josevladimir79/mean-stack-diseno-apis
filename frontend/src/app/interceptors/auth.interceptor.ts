import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

const RUTAS_PUBLICAS = [
  `${environment.apiURL}/usuarios`,
  `${environment.apiURL}/auth`,
];

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const esPublica = RUTAS_PUBLICAS.some((ruta) =>
      request.url.startsWith(ruta),
    );

    if (token && !esPublica) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !esPublica) {
          this.authService.logout();
        }
        return throwError(() => err);
      }),
    );
  }
}
