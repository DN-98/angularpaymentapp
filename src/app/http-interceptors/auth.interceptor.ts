import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthManagementService } from '../services/auth/auth-management.service';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthManagementService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler){
    const authToken = this.auth.getAuthorizationToken();
    const authReq = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // const authReq = request.clone({ setHeaders: { Authorization: "Bearer " + authToken } });
    return next.handle(authReq);
  }
}
