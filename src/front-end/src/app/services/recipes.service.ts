import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) {

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
}
