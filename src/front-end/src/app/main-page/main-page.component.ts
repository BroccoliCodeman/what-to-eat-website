import { Component, OnInit } from '@angular/core';
import { RecipeShort } from '../interfaces/recipeShort.interface';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';
import { IngredientsService } from '../services/ingredients.service';
import { RecipesService } from '../services/recipes.service';
import { SelectedIngredientsService } from '../services/selectedIngredients.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css', './main-search.css']
})
export class MainPageComponent implements OnInit{
  
  searchInputText:string="";

  constructor(){

  }

  ngOnInit(): void {

  }
}
