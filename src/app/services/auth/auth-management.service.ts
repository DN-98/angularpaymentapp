import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
  
export class AuthManagementService {
  endpoint: string = `https://deah-payment-api.herokuapp.com`;
  headers = new HttpHeaders().set('Content-Type', 'appilcation/json');

  constructor(private http: HttpClient, public router: Router) { }

  get isAuthenticated(){
    // let isTokenValid; 
    // this.cekToken().subscribe(
    //   () => { isTokenValid = true }, 
    //   ()=> { isTokenValid = false }
    // );
    return !!this.getAuthorizationToken();
  }

  getAuthorizationToken = () => sessionStorage.getItem('token')
  
  setAuthorizationToken = (token: string, refreshToken : string) => {
    sessionStorage.setItem('refreshToken', refreshToken);
    return sessionStorage.setItem('token', token);
  }

  login(user: User): Observable<any>{
    const api = `${this.endpoint}/api/authmanagement/login`;
    return this.http.post(api, user).pipe(catchError(this.errorHandler));
  }

  register(user: User): Observable<any>{
    const api = `${this.endpoint}/api/authmanagement/register`;
    return this.http.post(api, user).pipe(catchError(this.errorHandler));
  }

  // cekToken(){
  //   const api = `${this.endpoint}/api/authmanagement/RefreshToken`;
  //   return this.http.post(api, {"token" : sessionStorage.getItem('token'), "refreshToken" : sessionStorage.getItem('refreshToken')}).pipe(catchError(this.errorHandler));
  // }

  errorHandler = (err: HttpErrorResponse) => {
    return throwError(err)
  }
}
