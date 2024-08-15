import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/users/reset-password')) {
      return next.handle(request);
    }

    // For other requests, include the Authorization header
    const localToken = localStorage.getItem('token');
    if (localToken) {
      const reqWithToken = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localToken}`
        }
      });
      return next.handle(reqWithToken);
    } else {
      return next.handle(request);
    }
  }
}
