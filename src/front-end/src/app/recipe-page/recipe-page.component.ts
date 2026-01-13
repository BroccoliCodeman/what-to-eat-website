import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { Respond } from '../interfaces/respond.interface'; // Переконайся, що імпортуєш інтерфейс
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

  // --- Змінні для пагінації ---
  paginatedReviews: Respond[] = [];
  currentPage: number = 1;
  pageSize: number = 3; // Кількість відгуків на сторінці (зміни за бажанням)
  totalPages: number = 0;

  constructor(
    private recipeService: RecipesService,
    private activatedRouter: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.paramMap.get('id') as string || '';

    forkJoin({
      user: this.authService.getUser(),
      recipe: this.recipeService.getRecipeById(id)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ user, recipe }) => {
        // ... (код обробки user залишається без змін) ...
        if (!user.error) {
          this.user = user;
          if (this.user && this.user.avatar === 'string') {
            this.user.avatar = null;
          }
          if (this.user.savedRecipes && this.user.savedRecipes.length > 0) {
            this.isNotSaved = this.user.savedRecipes.some((savedRecipe: any) => savedRecipe.id === id);
          }
        } else {
          this.user = null;
        }

        // --- Обробка рецепту та ініціалізація пагінації ---
        if (recipe.statusCode === 200) {
          this.recipe = recipe.data;
          
          // Ініціалізуємо відгуки
          if (this.recipe && this.recipe.responds) {
            this.totalPages = Math.ceil(this.recipe.responds.length / this.pageSize);
            this.updatePaginatedReviews();
          }
          
          this.scrollToTop();
        }
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  // --- Методи пагінації ---
  
  updatePaginatedReviews() {
    if (this.recipe && this.recipe.responds) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      // Беремо шматочок масиву для поточної сторінки
      this.paginatedReviews = this.recipe.responds.slice(startIndex, endIndex);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedReviews();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedReviews();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedReviews();
  }

  // Генерація масиву номерів сторінок для відображення в HTML
  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // ... (решта методів: scrollToTop, getStars, saveRecipe залишаються без змін) ...
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getStars(rate: number): string {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rate ? '&#9733;' : '&#9734;';
    }
    return stars;
  }

  saveRecipe(): void {
     // ... твій код збереження ...
     if (!this.user || !this.recipe) return;
     this.authService.saveRecipe(this.user.id, this.recipe.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.isNotSaved = true;
          }
        }
      });
  }
}