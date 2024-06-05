import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipesService } from '../services/recipes.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css']
})
export class RecipePageComponent implements OnInit {

  recipe: Recipe | null = null;
  user: any = null;  // Initialize user as null
  isNotSaved: boolean = false;

  constructor(
    private recipeService: RecipesService,
    private activatedRouter: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.paramMap.get('id') as string || '';

    // Fetch user data
    this.authService.getUser().subscribe({
      next: (result) => {
        // Check if result contains an error
        if (result.error) {
          console.error('Unauthorized:', result.message);
          this.user = null;  // Ensure user is null if unauthorized
        } else {
          this.user = result;
          console.log('User fetched:', this.user);
          if (this.user && this.user.avatar === 'string') {
            this.user.avatar = null;
          }

          // Check if the current recipe is saved by the user
          if (this.user.savedRecipes && this.user.savedRecipes.length > 0) {
            this.isNotSaved = this.user.savedRecipes.some((recipe: any) => recipe.id === id);
          }
        }
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.user = null;  // Ensure user is null on any error
      }
    });

    // Fetch recipe data
    this.recipeService.getRecipeById(id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.recipe = res.data;
          this.scrollToTop();
        }
      },
      error: (error) => {
        console.error('Error fetching recipe:', error);
      }
    });
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

  saveRecipe() {
    if (this.user && this.recipe) {
      this.authService.saveRecipe(this.user.id, this.recipe.id).subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.ngOnInit();  // Refresh the component to update the UI
          }
        },
        error: (error) => {
          console.error('Error saving recipe:', error);
        }
      });
    }
  }
}
