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
  pagination : any;

  searchInputFocused:boolean=false;

  ingredientsList:SelectedIngredient[]=[];
  recipesSearchList:RecipeShort[]=[];

  selectedIngredients:SelectedIngredient[]=[];
  selectedSortOption:any;
  sortOptions:string[]=[
    'від А до Я',
    'від Я до А',
    'за збереженнями',
    'за збереженнями спадаючи',
    'за датою',
    'за датою спадаючи',
    'за калоріями',
    'за калоріями спадаючи'
  ];

  constructor(private recipeService: RecipesService, private route: ActivatedRoute, private router: Router,private ingredientsService:IngredientsService,private selectedIngredientsService:SelectedIngredientsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.title = params.get('title') || '';
    });
    this.searchRecipes();

    this.selectedIngredientsService.clearCart();
    this.selectedIngredients=this.selectedIngredientsService.selectedIngredients;
  }

  searchRecipes(): void {
    this.recipeService.getRecipes(this.title, this.getIngredients(), 1,this.getSortType())
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.recipes = response.body.data ?? [];
          console.log(response.body.data);
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

  getIngredients():string[]{
    let ingredients:string[]=[];
    this.selectedIngredients.forEach(
      x=>ingredients.push(x.name)
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
    this.recipeService.getRecipes(this.title, this.getIngredients(), page,this.getSortType())
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

  searchInputChange(){
    if(this.title.length>0){
      this.recipeService.getRecipesByNameLike(this.title)
      .subscribe((res:any)=>{
        if(res.statusCode==200){
          this.recipesSearchList=res.data;
        }else if(res.data.length==0){
          this.recipesSearchList=[];
        }
      }
    );
    this.ingredientsService.getIngredientsByNameLike(this.title)
      .subscribe((res:any)=>{
        if(res.statusCode==200){
          let data=res.data as SelectedIngredient[];
          data = data.filter(el => !this.selectedIngredients.some(selected => selected.id === el.id));
          this.ingredientsList=data;
        }else if(res.data.length==0){
          this.ingredientsList=[];
        }
      }
    );
    }else{
      this.ingredientsList=[];
      this.recipesSearchList=[];
    }
  }

  searchInputBlur(){
    setTimeout(() => this.searchInputFocused=false, 100);
  }

  //sorting
  getSortType():number{
    let result=this.sortOptions.indexOf(this.selectedSortOption);
    if (result>=0){
      return result+1;
    }else{
      return 0;
    }
  }

  //IngredientsLogic
  addIngredient(index:number){
    this.selectedIngredientsService.addtoList(this.ingredientsList[index]);
    this.title="";
    this.ingredientsList.splice(index, 1);
  }

  deleteIngredient(index:number){
    this.selectedIngredientsService.removeSelectedIngredient(index);
  }
}
