import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';

@Injectable({
  providedIn: 'root'
})
export class SelectedIngredientsService {

    selectedIngredients:SelectedIngredient[]=[];

  constructor(private http: HttpClient) {

   }

   getSelectedIngredients(){
    return this.selectedIngredients;
  }

  addtoList(item : SelectedIngredient){
      this.selectedIngredients.push(item);
  }

  removeSelectedIngredient(index:number){
    this.selectedIngredients.splice(index, 1);
  }

  clearCart(){
    this.selectedIngredients=[];
  }
}