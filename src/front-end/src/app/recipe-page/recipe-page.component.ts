import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipesService } from '../services/recipes.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css', ]
})
export class RecipePageComponent implements OnInit{

  recipe: Recipe | null = null;

  constructor(private recipeService: RecipesService, private activatedRouter: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.paramMap.get('id') as string || '';
    this.recipeService.getRecipeById(id).subscribe(
      res => {
        if (res.statusCode === 200){
          this.recipe = res.data;
        }
        console.log(this.recipe);
      }
    );
  }
}
