import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  constructor(private http: HttpClient) {

   }

   getIngredientsByNameLike(string:string): Observable<SelectedIngredient[]> {
    return this.http.get<SelectedIngredient[]>(
      `http://localhost:5000/api/Ingredient/GetByName/${string}`
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