import { Component } from '@angular/core';
import { ModelService } from '../services/model.service';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeShort } from '../interfaces/recipeShort.interface';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';
import { User } from '../interfaces/user.interface';
import { IngredientsService } from '../services/ingredients.service';
import { RecipesService } from '../services/recipes.service';
import { SelectedIngredientsService } from '../services/selectedIngredients.service';

@Component({
  selector: 'app-model-page',
  templateUrl: './model-page.component.html',
  styleUrls: ['./model-page.component.css']
})
export class ModelPageComponent {
  //
  selectedFile: File | null = null;
  filePreview: string | null = null;  // Property to store the preview URL

  uploaderror: boolean = false;
  //recommendedProducts: ProductWithRating[] = [];

  constructor(private modelService: ModelService,
      private ingredientsService:IngredientsService,
      private selectedIngredientsService:SelectedIngredientsService
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.createFilePreview(this.selectedFile); // Create preview for selected file
      this.uploadFile();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.remove('dragover');
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropZone = document.querySelector('.drop-zone');
    if (dropZone) dropZone.classList.remove('dragover');

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      this.createFilePreview(this.selectedFile); // Create preview for dropped file
      this.uploadFile();
      event.dataTransfer.clearData();
    }
  }

  createFilePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.filePreview = e.target.result; // Set the preview URL
    };
    reader.readAsDataURL(file);
  }

  uploadFile(): void {
    /*if (this.selectedFile) {
      this.modelService.uploadImage(this.selectedFile).subscribe(
        (response: any) => {
          console.log('Upload success:', response);
  
          if (response.result && response.data.length > 0) {
            const productIds = response.data.map((item: any) => item.productId);
            this.fetchRecommendedProducts(productIds);
            this.uploaderror = false;
          } else {
            console.log(response);
            this.uploaderror = true;
          }
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
    }*/
  }
  //

  title: string = '';
  
    user: User | undefined;
    searchInputFocused:boolean=false;
  
    ingredientsList:SelectedIngredient[]=[];
  
    selectedIngredients:SelectedIngredient[]=[];
  
    ngOnInit(): void {
      this.selectedIngredientsService.clearCart();
      this.selectedIngredients=this.selectedIngredientsService.selectedIngredients;
    }
  
    getIngredients():string[]{
      let ingredients:string[]=[];
      this.selectedIngredients.forEach(
        x=>ingredients.push(x.name)
      );
      return ingredients;
    }
  
  
    searchInputChange(): void {
      if (this.title.length > 0) {
  
        // Fetch ingredients matching the title
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
      }
    }
  
    searchInputBlur(){
      setTimeout(() => this.searchInputFocused=false, 100);
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

    searchRecipes(){

    }
}
