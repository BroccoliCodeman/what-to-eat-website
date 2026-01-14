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
import { delay } from 'rxjs';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
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

  constructor(private recipeService: RecipesService,
    private route: ActivatedRoute,
    private router: Router,
    private ingredientsService: IngredientsService,
    private selectedIngredientsService: SelectedIngredientsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') || '';
    });

    if (!this.selectedIngredientsService.isFromEronDonDon) {
      this.searchRecipes();

      this.selectedIngredientsService.clearCart();
      this.selectedIngredients = this.selectedIngredientsService.selectedIngredients;
    }
    else {
      this.selectedIngredients = this.selectedIngredientsService.selectedIngredients;

      this.searchRecipes();
    }
  }

  // Виправлена обробка помилок для аватарів
  onAvatarError(event: any, recipe: Recipe) {
    console.log('Avatar loading error for recipe:', recipe?.id || 'unknown');
    event.target.src = 'assets/images/default_user.jpg';
  }

  // Додана обробка помилок для фото рецептів  
  onRecipeImageError(event: any, recipe: Recipe) {
    console.log('Recipe image loading error for recipe:', recipe.id);
    event.target.src = 'assets/images/default_recipe.jpg';
  }

  // Допоміжний метод для отримання URL фото з обробкою помилок
  getRecipePhotoUrl(recipe: Recipe): string {
    return recipe.photo || 'assets/images/default_recipe.jpg';
  }

  // Допоміжний метод для отримання URL аватару з обробкою помилок
  getAvatarUrl(recipe: Recipe): string {
    if (recipe && recipe.user && recipe.user.avatar) {
      return recipe.user.avatar;
    }
    return 'assets/images/default_user.jpg';
  }

  searchRecipes(): void {
    this.recipeService.getRecipes(this.title, this.getIngredients(), 1, this.getSortType())
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.recipes = response.body.data ?? [];
          console.log(this.recipes)
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
          } else {
            console.error('Error:', error);
          }
        }
      });
  }

  getIngredients(): string[] {
    let ingredients: string[] = [];
    this.selectedIngredients.forEach(
      x => ingredients.push(x!.name!)
    );
    return ingredients;
  }

  loadNextPage(): void {
    if (this.pagination && this.pagination.HasNext) {
      const nextPage = this.pagination.CurrentPage + 1;
      this.loadRecipesForPage(nextPage);
    }
  }

  loadPreviousPage(): void {
    if (this.pagination && this.pagination.HasPrevious) {
      const previousPage = this.pagination.CurrentPage - 1;
      this.loadRecipesForPage(previousPage);
    }
  }

getPaginationList(): (number | string)[] {
  if (!this.pagination) return [];
  
  const totalPages = this.pagination.TotalPages;
  const currentPage = this.pagination.CurrentPage;

  // Якщо сторінок мало (до 7), показуємо всі
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Завжди додаємо першу сторінку
  pages.push(1);

  // Якщо ми далеко від початку (наприклад, на 5-й сторінці), додаємо "..."
  if (currentPage > 4) {
    pages.push('...');
  }

  // Визначаємо діапазон сусідніх сторінок
  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  // Якщо ми на початку (сторінки 1, 2, 3, 4), показуємо перші 5
  if (currentPage <= 4) {
    end = 5;
    start = 2;
  }

  // Якщо ми в кінці, показуємо останні 5
  if (currentPage >= totalPages - 3) {
    start = totalPages - 4;
    end = totalPages - 1;
  }

  // Заповнюємо середину
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Якщо ми далеко від кінця, додаємо "..."
  if (currentPage < totalPages - 3) {
    pages.push('...');
  }

  // Завжди додаємо останню сторінку
  pages.push(totalPages);

  return pages;
}

// 2. Додайте методи для переходу на початок і кінець:
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

  // Змініть тип аргументу на (number | string)
  loadRecipesForPage(page: number | string): void {
    
    // Додайте перевірку: якщо це рядок (наприклад, "..."), нічого не робимо
    if (typeof page !== 'number') return;

    this.recipeService.getRecipes(this.title, this.getIngredients(), page, this.getSortType())
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Recipes:', response.body);
          this.recipes = response.body.data ?? [];
          this.pagination = JSON.parse(response.headers.get('X-Pagination') || '{}');
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
          } else {
            console.error('Error:', error);
          }
        }
      });
  }

  goToRecipePage(recipeId: string): void {
    this.router.navigate(['/recipe-page', recipeId]);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  searchInputChange(): void {
    if (this.title.length > 0) {
      this.recipeService.getRecipesByNameLike(this.title)
        .subscribe({
          next: (res: any) => {
            if (res.statusCode === 200) {
              this.recipesSearchList = res.data;
            } else if (res.data.length === 0) {
              this.recipesSearchList = [];
            }
          },
          error: (error: any) => {
            console.error('Error fetching recipes:', error);
            this.recipesSearchList = [];
          }
        });

      this.ingredientsService.getIngredientsByNameLike(this.title)
        .subscribe({
          next: (res: any) => {
            if (res.statusCode === 200) {
              let data = res.data as SelectedIngredient[];
              data = data.filter(el => !this.selectedIngredients.some(selected => selected.id === el.id));
              this.ingredientsList = data;
            } else if (res.data.length === 0) {
              this.ingredientsList = [];
            }
          },
          error: (error: any) => {
            console.error('Error fetching ingredients:', error);
            this.ingredientsList = [];
          }
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
    if (result >= 0) {
      return result + 1;
    } else {
      return 0;
    }
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