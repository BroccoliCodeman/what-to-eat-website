import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) {

   }

   getIngredientsByNameLike(string:string): Observable<HttpResponse<SelectedIngredient[]>> {
    const params = new HttpParams().set('name', string);
    return this.http.get<HttpResponse<SelectedIngredient[]>>(
      `http://localhost:5000/api/Ingredient/GetByName`, { params }
    );
  }

  getMultipleByNames(names: string[]): Observable<SelectedIngredient[]> {
    let params = new HttpParams();
    names.forEach(n => {
      params = params.append('name', n);
    });

    return this.http.get<SelectedIngredient[]>('http://localhost:5000/api/Ingredient/GetMultipleByName', { params });
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