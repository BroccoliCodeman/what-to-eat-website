import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipes.service';
import { Recipe } from '../interfaces/recipe.interface';
import { User } from '../interfaces/user.interface';
import { HttpResponse } from '@angular/common/http';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';
import { RecipeShort } from '../interfaces/recipeShort.interface';
import { IngredientsService } from '../services/ingredients.service';
import { SelectedIngredientsService } from '../services/selectedIngredients.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  title: string = '';

  recipes: Recipe[] = [];
  user: User | undefined;
  pagination: any;
  TotalCount: number = 0;
  searchInputFocused: boolean = false;

  ingredientsList: SelectedIngredient[] = [];
  recipesSearchList: RecipeShort[] = [];

  selectedIngredients: SelectedIngredient[] = [];
  selectedSortOption: any;
  sortOptions: string[] = [
    'від А до Я',
    'від Я до А',
    'за збереженнями',
    'за збереженнями спадаючи',
    'за датою',
    'за датою спадаючи',
    'за калоріями',
    'за калоріями спадаючи'
  ];

  constructor(
    private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private ingredientsService: IngredientsService,
    private selectedIngredientsService: SelectedIngredientsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') || '';
    });

    if (!this.selectedIngredientsService.isFromEronDonDon) {
      this.searchRecipes();
      this.selectedIngredientsService.clearCart();
      this.selectedIngredients = this.selectedIngredientsService.selectedIngredients;
    } else {
      this.selectedIngredients = this.selectedIngredientsService.selectedIngredients;
      this.searchRecipes();
    }
  }

  // --- Image Handling ---
  onAvatarError(event: any, recipe: Recipe) {
    event.target.src = 'assets/images/default_user.jpg';
  }

  onRecipeImageError(event: any, recipe: Recipe) {
    event.target.src = 'assets/images/default_recipe.jpg';
  }

  getRecipePhotoUrl(recipe: Recipe): string {
    return recipe.photo || 'assets/images/default_recipe.jpg';
  }

  getAvatarUrl(recipe: Recipe): string {
    if (recipe && recipe.user && recipe.user.avatar) {
      return recipe.user.avatar;
    }
    return 'assets/images/default_user.jpg';
  }

  // --- Search & Filter ---
  searchRecipes(): void {
    this.recipeService.getRecipes(this.title, this.getIngredients(), 1, this.getSortType())
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.recipes = response.body.data ?? [];
          this.pagination = JSON.parse(response.headers.get('X-Pagination') || '{}');
          this.TotalCount = this.pagination.TotalCount;
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.recipes = [];
            this.pagination = {
              TotalCount: 0,
              PageSize: 0,
              CurrentPage: 1,
              TotalPages: 1,
              HasNext: false,
              HasPrevious: false
            };
            this.TotalCount = 0;
          } else {
            console.error('Error:', error);
          }
        }
      });
  }

  getIngredients(): string[] {
    let ingredients: string[] = [];
    this.selectedIngredients.forEach(x => ingredients.push(x!.name!));
    return ingredients;
  }

  // --- Pagination Logic (UPDATED) ---

  loadNextPage(): void {
    if (this.pagination && this.pagination.HasNext) {
      this.loadRecipesForPage(this.pagination.CurrentPage + 1);
    }
  }

  loadPreviousPage(): void {
    if (this.pagination && this.pagination.HasPrevious) {
      this.loadRecipesForPage(this.pagination.CurrentPage - 1);
    }
  }

  loadFirstPage(): void {
    if (this.pagination && this.pagination.CurrentPage !== 1) {
      this.loadRecipesForPage(1);
      this.scrollToTop();
    }
  }

  loadLastPage(): void {
    if (this.pagination && this.pagination.CurrentPage !== this.pagination.TotalPages) {
      this.loadRecipesForPage(this.pagination.TotalPages);
      this.scrollToTop();
    }
  }

  // Генерує список сторінок з "..."
  getPaginationList(): (number | string)[] {
    if (!this.pagination) return [];
    
    const totalPages = this.pagination.TotalPages;
    const currentPage = this.pagination.CurrentPage;
  
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
  
    const pages: (number | string)[] = [];
    pages.push(1);
  
    if (currentPage > 4) {
      pages.push('...');
    }
  
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
  
    if (currentPage <= 4) {
      end = 5;
      start = 2;
    }
  
    if (currentPage >= totalPages - 3) {
      start = totalPages - 4;
      end = totalPages - 1;
    }
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    if (currentPage < totalPages - 3) {
      pages.push('...');
    }
  
    pages.push(totalPages);
  
    return pages;
  }

  // Приймає number або string (для коректної роботи шаблону), але обробляє тільки number
  loadRecipesForPage(page: number | string): void {
    if (typeof page !== 'number') return;

    this.recipeService.getRecipes(this.title, this.getIngredients(), page, this.getSortType())
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.recipes = response.body.data ?? [];
          this.pagination = JSON.parse(response.headers.get('X-Pagination') || '{}');
          this.TotalCount = this.pagination.TotalCount;
        },
        error: (error: any) => {
          console.error('Page load error:', error);
        }
      });
  }

  // --- UI Helpers ---
  goToRecipePage(recipeId: string): void {
    this.router.navigate(['/recipe-page', recipeId]);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Search Helpers ---
  searchInputChange(): void {
    if (this.title.length > 0) {
      this.recipeService.getRecipesByNameLike(this.title).subscribe({
        next: (res: any) => this.recipesSearchList = (res.statusCode === 200) ? res.data : [],
        error: () => this.recipesSearchList = []
      });

      this.ingredientsService.getIngredientsByNameLike(this.title).subscribe({
        next: (res: any) => {
          if (res.statusCode === 200) {
            let data = res.data as SelectedIngredient[];
            this.ingredientsList = data.filter(el => !this.selectedIngredients.some(sel => sel.id === el.id));
          } else {
            this.ingredientsList = [];
          }
        },
        error: () => this.ingredientsList = []
      });
    } else {
      this.ingredientsList = [];
      this.recipesSearchList = [];
    }
  }

  searchInputBlur() {
    setTimeout(() => this.searchInputFocused = false, 100);
  }

  getSortType(): number {
    let result = this.sortOptions.indexOf(this.selectedSortOption);
    return result >= 0 ? result + 1 : 0;
  }

  addIngredient(index: number) {
    this.selectedIngredientsService.addtoList(this.ingredientsList[index]);
    this.title = "";
    this.ingredientsList.splice(index, 1);
  }

  deleteIngredient(index: number) {
    this.selectedIngredientsService.removeSelectedIngredient(index);
  }
}