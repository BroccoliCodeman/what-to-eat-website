import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

   }
   logInUser(email: string, password: string): Observable<any> {
    const obj = {
      email: email,
      password: password
    };

    return this.http.post(`http://localhost:5000/api/Auth/login`, obj).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    return of({ error: true, message: errorMessage });
  }

  registerUser(email: string, firstName:string,photo:string,lastName:string,password: string,confirmPassword:string): Observable<any> {
    const obj = {
      email: email,
      firstName: firstName,
      avatar: photo,
      lastName: lastName,
      password: password,
      passwordRepeat:confirmPassword
    };

    return this.http.post(`http://localhost:5000/api/Auth/register`, obj).pipe(
      catchError(this.handleError)
    );
  }

  getUser(): Observable<any> {

    return this.http.get(`http://localhost:5000/api/Auth/`).pipe(
      catchError(this.handleError)
    );
  }
}
