import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // List of URLs to exclude from base URL prepend
    const excludeUrls = ['generate-advice'];

    // Check if the request URL contains any of the excluded endpoints
    const shouldExclude = excludeUrls.some(url => request.url.includes(url));

    // Prepend base URL only if the request URL is not in the excluded list
    const modifiedRequest = shouldExclude ? request : request.clone({
      url: `${environment.apiUrl}/${request.url}`
    });

    return next.handle(modifiedRequest);
  }
}
