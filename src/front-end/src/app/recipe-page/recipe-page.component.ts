import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css']
})
export class RecipePageComponent implements OnInit{

  recipe:any;

  constructor(private recipeService:RecipesService,private activatedRouter:ActivatedRoute){

  }

  ngOnInit(): void {
    let id=this.activatedRouter.snapshot.paramMap.get('id')as string || '';
    this.recipeService.getRecipeById(id).subscribe(
      res => {
        this.recipe=res;
        console.log(this.recipe);
      }
    );
  }
}
