import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipesService } from '../services/recipes.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css', ]
})
export class RecipePageComponent implements OnInit{

  recipe: Recipe | null = null;
  user: any;

  isNotSaved: boolean = false;

  constructor(private recipeService: RecipesService, private activatedRouter: ActivatedRoute,  private authService: AuthService) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.paramMap.get('id') as string || '';

    this.authService.getUser().subscribe((result) => {
      this.user = result;
      if (this.user.avatar === 'string') {
        this.user.avatar = null;
      }

      // Check if the current recipe is saved by the user
      if (this.user.savedRecipes && this.user.savedRecipes.length > 0) {
        this.isNotSaved = this.user.savedRecipes.some((recipe: any) => recipe.id === id);
      }

    });

    this.recipeService.getRecipeById(id).subscribe(
      res => {
        if (res.statusCode === 200){
          this.recipe = res.data;
          this.scrollToTop();
        }
      }
    );
}

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  getStars(rate: number): string {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rate ? '&#9733;' : '&#9734;';
    }
    return stars;
  }

  saveRecipe(){
    this.authService.saveRecipe(this.user.id, this.recipe?.id || "").subscribe(
      res => {
        if (res.statusCode === 200){
         this.ngOnInit();
        }
      },
      error => {
        console.log("Error: ", error)
      }
    );
  }
}
