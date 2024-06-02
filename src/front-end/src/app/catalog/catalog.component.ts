import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../services/recipes.service';
import { Recipe } from '../interfaces/recipe.interface';
import { User } from '../interfaces/user.interface';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent {
  title: string = '';
  ingredients: string = '';

  recipes: Recipe[] = [];
  user: User | undefined;
  pagination : any;

  constructor(private recipeService: RecipesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') || '';
    });
    this.searchRecipes();
  }

  searchRecipes(): void {
    this.recipeService.getRecipes(this.title, [this.ingredients], 1)
      .subscribe({
        next: (response: HttpResponse<any>) => {
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
            // Handle other types of errors as needed.
          }
        }
      });
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
  getPageNumbers(): number[] {
    const totalPages = this.pagination.TotalPages;
    const currentPage = this.pagination.CurrentPage;
    const pageNumbers: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  loadRecipesForPage(page: number): void {
    this.recipeService.getRecipes(this.title, [this.ingredients], page)
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
            // Handle other types of errors as needed.
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
}
