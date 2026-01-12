import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipesService } from '../services/recipes.service';
import { AuthService } from '../services/auth.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.css']
})
export class RecipePageComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  user: any = null;
  isNotSaved: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private recipeService: RecipesService,
    private activatedRouter: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.paramMap.get('id') as string || '';

    // Fetch both user and recipe data in parallel
    console.log('Fetching data for recipe ID:', id);
    forkJoin({
      user: this.authService.getUser(),
      recipe: this.recipeService.getRecipeById(id)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ user, recipe }) => {
        // Handle user data
        if (!user.error) {
          this.user = user;
          console.log('User fetched:', this.user);
          
          // Fix avatar if it's a placeholder string
          if (this.user && this.user.avatar === 'string') {
            this.user.avatar = null;
          }

          // Check if the current recipe is already saved by the user
          if (this.user.savedRecipes && this.user.savedRecipes.length > 0) {
            this.isNotSaved = this.user.savedRecipes.some((savedRecipe: any) => savedRecipe.id === id);
          }
        } else {
          console.warn('User not authenticated:', user.message);
          this.user = null;
        }

        // Handle recipe data
        if (recipe.statusCode === 200) {
          this.recipe = recipe.data;
          console.log('Recipe fetched:', this.recipe);
          this.scrollToTop();
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToTop(): void {
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

  saveRecipe(): void {
    if (!this.user || !this.recipe) {
      console.warn('User or recipe not available');
      return;
    }

    this.authService.saveRecipe(this.user.id, this.recipe.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            // Update the button state without reloading the entire component
            this.isNotSaved = true;
            console.log('Recipe saved successfully');
          }
        },
        error: (error) => {
          console.error('Error saving recipe:', error);
        }
      });
  }
}