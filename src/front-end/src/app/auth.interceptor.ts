import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('cloudinary.com')) {
      // Pass the request through WITHOUT adding the Authorization header
      return next.handle(request);
    }

    let token=localStorage.getItem('token');
    request=request.clone({headers: request.headers.set('Authorization','bearer '+token)});
    return next.handle(request);
  }
}
