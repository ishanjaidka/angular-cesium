import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { flatMap, catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Observable, throwError, from } from 'rxjs';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private _as: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse, caught?: Observable<HttpEvent<any>>) => {
      if (error) {
        return throwError(error);
      }
      return from(this._as.refreshToken()).pipe(flatMap(isRefreshed => isRefreshed ? next.handle(request) : throwError(error)));
    })) as Observable<HttpEvent<any>>;
  }
}
