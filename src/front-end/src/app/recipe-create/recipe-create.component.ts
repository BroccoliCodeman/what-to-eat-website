import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudinaryService } from '../services/cloudinary.service';
import { RecipesService } from '../services/recipes.service';
import { IngredientsService } from '../services/ingredients.service';
import { AuthService } from '../services/auth.service';
import { WeightUnitService } from '../services/weight-unit.service'; // Імпорт нового сервісу
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';
import { RecipeDto } from '../interfaces/recipe-create.interface';
import { Component, OnInit, HostListener } from '@angular/core';
@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  recipeForm: FormGroup;
  photoUrl: string = '';
  isUploading: boolean = false;
  
  // Змінні для автодоповнення інгредієнтів
  searchResults: SelectedIngredient[] = [];
  isSearchFocused: boolean = false;
  currentIngredientIndex: number = -1;

  // Змінили тип на any[], оскільки з бекенду прийдуть об'єкти {id, type}
  weightUnits: any[] = []; 
openDropdownIndex: number = -1;
  constructor(
    private fb: FormBuilder,
    private cloudinaryService: CloudinaryService,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService,
    private weightUnitService: WeightUnitService, // Інжектимо сервіс
    private authService: AuthService,
    private router: Router
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
    // Завантажуємо одиниці виміру з бекенду
    this.loadWeightUnits();
    
    // Додаємо початкові поля
    this.addIngredient();
    this.addStep();
  }

  loadWeightUnits() {
    this.weightUnitService.getWeightUnits().subscribe({
      next: (res: any) => {
        // Перевіряємо структуру відповіді (зазвичай дані в полі data)
        if (res.data) {
           this.weightUnits = res.data;
        } else {
           this.weightUnits = res;
        }
      },
      error: (err) => console.error('Failed to load weight units', err)
    });
  }

  // --- Getters ---
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get cookingSteps() {
    return this.recipeForm.get('cookingSteps') as FormArray;
  }

  // --- Image Upload ---
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.cloudinaryService.uploadMedia(file).subscribe({
        next: (url) => {
          this.photoUrl = url;
          this.isUploading = false;
        },
        error: (err) => {
          console.error('Upload failed', err);
          this.isUploading = false;
        }
      });
    }
  }

  // --- Ingredients Management ---
  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required] // Спочатку пусте, користувач вибере зі списку
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  // Пошук інгредієнтів
  searchIngredient(event: any, index: number) {
    const query = event.target.value;
    this.currentIngredientIndex = index;
    
    if (query.length > 1) {
      this.ingredientsService.getIngredientsByNameLike(query).subscribe({
        next: (res: any) => {
          this.searchResults = res.body || res.data || res || [];
        },
        error: () => this.searchResults = []
      });
      this.isSearchFocused = true;
    } else {
      this.searchResults = [];
      this.isSearchFocused = false;
    }
  }

  selectIngredient(ingredient: SelectedIngredient) {
    if (this.currentIngredientIndex > -1) {
      this.ingredients.at(this.currentIngredientIndex).patchValue({
        name: ingredient.name
      });
      this.searchResults = [];
      this.isSearchFocused = false;
    }
  }

  hideSearch() {
    setTimeout(() => this.isSearchFocused = false, 200);
  }

  // --- Steps Management ---
  addStep() {
    const stepGroup = this.fb.group({
      description: ['', Validators.required]
    });
    this.cookingSteps.push(stepGroup);
  }

  removeStep(index: number) {
    if (this.cookingSteps.length > 1) {
      this.cookingSteps.removeAt(index);
    }
  }

  // --- Submit ---
  submitRecipe() {
    if (this.recipeForm.invalid || this.isUploading) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    const formValue = this.recipeForm.value;

    const newRecipe: RecipeDto = {
      title: formValue.title,
      description: formValue.description,
      photo: this.photoUrl || 'assets/images/default_recipe.jpg',
      cookingTime: formValue.cookingTime,
      calories: formValue.calories,
      servings: formValue.servings,
      ingredients: formValue.ingredients.map((ing: any) => ({
        name: ing.name,
        quantity: ing.quantity,
        // Оскільки unit тепер приходить з бекенду як string (type), передаємо його так само
        weightUnit: { type: ing.unit } 
      })),
      cookingSteps: formValue.cookingSteps.map((step: any, index: number) => ({
        description: step.description,
        order: index + 1
      }))
    };

    console.log('Sending recipe:', newRecipe);

    this.recipesService.createRecipe(newRecipe).subscribe({
      next: () => {
        alert('Рецепт успішно створено!');
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        console.error('Error creating recipe:', err);
        alert('Виникла помилка при створенні рецепту.');
      }
    });
  }

  // Відкрити/Закрити список для конкретного рядка
  toggleUnitDropdown(index: number, event: Event) {
    event.stopPropagation(); // Зупиняємо спливання події, щоб document click не спрацював одразу
    if (this.openDropdownIndex === index) {
      this.openDropdownIndex = -1; // Закрити, якщо вже відкрито
    } else {
      this.openDropdownIndex = index; // Відкрити новий
      this.isSearchFocused = false; // Закрити пошук інгредієнтів, якщо він відкритий
    }
  }

  // Вибрати опцію
  selectUnit(unitType: string, index: number) {
    this.ingredients.at(index).patchValue({ unit: unitType });
    this.openDropdownIndex = -1;
  }

  // Закрити при кліку в будь-якому іншому місці
  @HostListener('document:click', ['$event'])
  closeDropdowns() {
    this.openDropdownIndex = -1;
  }
}