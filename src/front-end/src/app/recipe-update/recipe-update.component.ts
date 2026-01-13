import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryService } from '../services/cloudinary.service';
import { RecipesService } from '../services/recipes.service';
import { IngredientsService } from '../services/ingredients.service';
import { WeightUnitService } from '../services/weight-unit.service';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';
import { RecipeDto } from '../interfaces/recipe-create.interface';
import { Recipe } from '../interfaces/recipe.interface';

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html',
  styleUrls: ['./recipe-update.component.css'] // Використовуємо стилі створення
})
export class RecipeUpdateComponent implements OnInit {
  recipeForm: FormGroup;
  photoUrl: string = '';
  isUploading: boolean = false;
  recipeId: string = '';
  
  searchResults: SelectedIngredient[] = [];
  isSearchFocused: boolean = false;
  currentIngredientIndex: number = -1;
  openDropdownIndex: number = -1;
  weightUnits: any[] = []; 

  constructor(
    private fb: FormBuilder,
    private cloudinaryService: CloudinaryService,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private weightUnitService: WeightUnitService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      cookingTime: [null, [Validators.required, Validators.min(1)]],
      calories: [null, [Validators.required, Validators.min(1)]],
      servings: [null, [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([]),
      cookingSteps: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadWeightUnits();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipeId = id;
        this.loadRecipeData(id);
      }
    });
  }

  loadWeightUnits() {
    this.weightUnitService.getWeightUnits().subscribe({
      next: (res: any) => this.weightUnits = res.data || res
    });
  }

  loadRecipeData(id: string) {
    this.recipesService.getRecipeById(id).subscribe({
      next: (res: any) => {
        const recipe: Recipe = res.data || res;

        this.photoUrl = recipe.photo || '';

        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          calories: recipe.calories,
          servings: recipe.servings
        });

        // Очищаємо масиви перед заповненням
        this.ingredients.clear();
        this.cookingSteps.clear();

        if (recipe.ingredients) {
          recipe.ingredients.forEach(ing => {
            const group = this.fb.group({
              name: [ing.name, Validators.required],
              quantity: [ing.quantity, Validators.required],
              unit: [ing.weightUnit?.type || '', Validators.required]
            });
            this.ingredients.push(group);
          });
        }

        if (recipe.cookingSteps) {
          const steps = recipe.cookingSteps.sort((a, b) => (a.order || 0) - (b.order || 0));
          steps.forEach(step => {
            const group = this.fb.group({
              id: [step.id], // Зберігаємо ID існуючого кроку
              description: [step.description, Validators.required]
            });
            this.cookingSteps.push(group);
          });
        }
        
        if (this.ingredients.length === 0) this.addIngredient();
        if (this.cookingSteps.length === 0) this.addStep();
      },
      error: (err) => console.error('Error loading recipe', err)
    });
  }

  get ingredients() { return this.recipeForm.get('ingredients') as FormArray; }
  get cookingSteps() { return this.recipeForm.get('cookingSteps') as FormArray; }

  addIngredient() {
    this.ingredients.push(this.fb.group({
      name: ['', Validators.required],
      quantity: [null, Validators.required],
      unit: ['', Validators.required]
    }));
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) this.ingredients.removeAt(index);
  }

  addStep() {
    // Новий крок, ID поки немає
    this.cookingSteps.push(this.fb.group({ description: ['', Validators.required], id: [null] }));
  }

  removeStep(index: number) {
    if (this.cookingSteps.length > 1) this.cookingSteps.removeAt(index);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.cloudinaryService.uploadMedia(file).subscribe({
        next: (url) => { this.photoUrl = url; this.isUploading = false; },
        error: () => this.isUploading = false
      });
    }
  }

  // --- Dropdowns & Search ---
  toggleUnitDropdown(index: number, event: Event) {
    event.stopPropagation();
    this.openDropdownIndex = this.openDropdownIndex === index ? -1 : index;
    this.isSearchFocused = false;
  }

  selectUnit(unitType: string, index: number) {
    this.ingredients.at(index).patchValue({ unit: unitType });
    this.openDropdownIndex = -1;
  }

  @HostListener('document:click')
  closeDropdowns() { this.openDropdownIndex = -1; }

  searchIngredient(event: any, index: number) {
    const query = event.target.value;
    this.currentIngredientIndex = index;
    if (query.length > 1) {
      this.ingredientsService.getIngredientsByNameLike(query).subscribe({
        next: (res: any) => this.searchResults = res.body || res.data || [],
        error: () => this.searchResults = []
      });
      this.isSearchFocused = true;
    } else {
      this.isSearchFocused = false;
    }
  }

  selectIngredient(ingredient: SelectedIngredient) {
    if (this.currentIngredientIndex > -1) {
      this.ingredients.at(this.currentIngredientIndex).patchValue({ name: ingredient.name });
      this.isSearchFocused = false;
    }
  }
  
  hideSearch() { setTimeout(() => this.isSearchFocused = false, 200); }

  // --- SUBMIT ---
  submitRecipe() {
    if (this.recipeForm.invalid || this.isUploading) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const formValue = this.recipeForm.value;
    const emptyGuid = '00000000-0000-0000-0000-000000000000'; // Для нових кроків

    const updatedRecipe: RecipeDto = {
      id: this.recipeId, 
      title: formValue.title,
      description: formValue.description,
      photo: this.photoUrl,
      cookingTime: formValue.cookingTime,
      calories: formValue.calories,
      servings: formValue.servings,
      
      ingredients: formValue.ingredients.map((ing: any) => ({
        name: ing.name,
        quantity: ing.quantity,
        weightUnit: { type: ing.unit } 
      })),

      cookingSteps: formValue.cookingSteps.map((step: any, index: number) => ({
        // Якщо є ID (старий крок) - беремо його, якщо ні (новий) - emptyGuid
        id: step.id || emptyGuid, 
        description: step.description,
        order: index + 1,
        recipeId: this.recipeId 
      }))
    };

    console.log('Sending Update Payload:', updatedRecipe);

    this.recipesService.updateRecipe(this.recipeId, updatedRecipe).subscribe({
      next: () => {
        alert('Рецепт успішно оновлено!');
        this.router.navigate(['/recipe-page', this.recipeId]);
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Помилка при оновленні. Перевірте консоль.');
      }
    });
  }
}