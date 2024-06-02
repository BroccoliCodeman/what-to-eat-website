import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeShort } from '../interfaces/recipeShort.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) {

  }

   getIngredientsByNameLike(string:string): Observable<RecipeShort[]> {
    return this.http.get<RecipeShort[]>(
      `http://localhost:5000/api/Recipe/GetByTitle/${string}`
    );
  }

  getRecipeById(string:string): Observable<any> {
    return this.http.get<Recipe>(
      `http://localhost:5000/api/Recipe/${string}`
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
