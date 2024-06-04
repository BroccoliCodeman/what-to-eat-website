import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeShort } from '../interfaces/recipeShort.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private http: HttpClient) {}

  getRecipes(title: string, ingredients: string[], page: number): Observable<HttpResponse<Recipe[]>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });

    const body = {
      title: title,
      ingredients: ingredients
    };

    const sortType = 0;

    return this.http.post<Recipe[]>(
      `http://localhost:5000/api/Recipe/Get?sortType=${sortType}&PageNumber=${page}`,
      body,
      { headers: headers, observe: 'response' }
    );
  }

   getRecipesByNameLike(string:string): Observable<HttpResponse<RecipeShort[]>> {
    const params = new HttpParams().set('title', string);
    return this.http.get<HttpResponse<RecipeShort[]>>(
      `http://localhost:5000/api/Recipe/GetByTitle`,{params}
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
