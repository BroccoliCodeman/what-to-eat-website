import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {

   }
   forgotPassword(email: string): Observable<any> {
    const params = new HttpParams().set('Email', email);

    return this.http.post(`http://localhost:5000/api/Auth/ForgotPassword`, null, { params }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(id: string, code: string, newpas: string): Observable<any> {
    const params = new HttpParams()
      .set('Id', id)
      .set('Code', code)
      .set('newpas',newpas);

      const headers=new HttpHeaders()
      .set('Content-Type','application/json')
      .set('accept','*/*');

    return this.http.post(`http://localhost:5000/api/Auth/ResetPassword`, null, {headers:headers,params: params} ).pipe(
      catchError(this.handleError)
    );
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

  getSavedRecipes(id: string) {
    return this.http.get(`http://localhost:5000/api/Recipe/GetRecipesByUserId/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user:any){
    return this.http.put(`http://localhost:5000/api/Auth/`, user).pipe(
      catchError(this.handleError)
    );
  }

  saveRecipe(userId: string, recipeId:string){
    if (recipeId === "" || userId === ""){
      alert("Error while saving recipe!")
    }
    return this.http.post(`http://localhost:5000/api/Recipe/SaveRecipe?UserId=${userId}&RecipeId=${recipeId}`, null).pipe(
      catchError(this.handleError)
    );
  }
}
