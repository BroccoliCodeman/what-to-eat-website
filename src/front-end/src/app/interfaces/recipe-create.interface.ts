export interface RecipeDto {
  id?: string | null;
  servings?: number;
  cookingTime?: number;
  title?: string;
  photo?: string;
  description: string;
  calories?: number;
  creationDate?: string | Date;
  ingredients: IngredientDto[];
  cookingSteps?: CookingStepDto[];
  responds?: RespondDto[];
  user?: any; // DTO користувача
  savesCount?: number;
}

export interface IngredientDto {
  quantity?: number;
  name?: string;
  // Важливо: бекенд очікує об'єкт WeightUnitDto всередині
  weightUnit?: { 
    id?: number; 
    type?: string; 
  };
}

export interface CookingStepDto {
  id?: string; // C# Guid, не може бути null
  description?: string;
  order?: number;
  recipeId?: string; // C# Guid
}

export interface RespondDto {
  id?: string;
  text?: string;
  rate?: number;
  user?: any;
}