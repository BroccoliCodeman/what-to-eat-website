import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeShort } from '../interfaces/recipeShort.interface';
import { RecipeDto as RecipeDto } from '../interfaces/recipe-create.interface';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
private apiUrl = 'http://localhost:5000/api/Recipe'; // Базовий URL
  constructor(private http: HttpClient) {}

  getRecipes(title: string, ingredients: string[], page: number,sortType:number): Observable<HttpResponse<Recipe[]>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'text/plain'
    });

    const body = {
      title: title,
      ingredients: ingredients
    };

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
// Новий метод для створення рецепту
  createRecipe(recipe: RecipeDto): Observable<any> {
    return this.http.post(`http://localhost:5000/api/Recipe/PostWithIngredientsAndCookingSteps`, recipe);
  }

  updateRecipe(id: string, recipe: RecipeDto): Observable<any> {
  // Припускаємо, що на бекенді буде PUT endpoint: api/Recipe/{id}
  // Або POST, залежно від твоєї реалізації
  return this.http.put(`http://localhost:5000/api/Recipe/${id}`, recipe);
}

// Метод збереження рецепту
  saveRecipe(userId: string, recipeId: string): Observable<any> {
    const params = new HttpParams()
      .set('UserId', userId)
      .set('RecipeId', recipeId);

    return this.http.post(`${this.apiUrl}/SaveRecipe`, {}, { params });
  }

  // Метод видалення зі збережених
  removeRecipeFromSaved(userId: string, recipeId: string): Observable<any> {
    const params = new HttpParams()
      .set('UserId', userId)
      .set('RecipeId', recipeId);

    return this.http.post(`${this.apiUrl}/RemoveRecipeFromSaved`, {}, { params });
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
