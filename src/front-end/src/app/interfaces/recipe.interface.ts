import { CookingStep } from "./cookingStep.interface";
import { Ingredient } from "./ingredient.interface";
import { Respond } from "./respond.interface";
import { User } from "./user.interface";

export interface Recipe{
    id:string,
    servings:number,
    cookingTime:number,
    title:string,
    photo:string,
    description:string,
    calories:number,
    creationDate:Date,
    ingredients:Ingredient[],
    cookingSteps:CookingStep[],
    responds:Respond[],
    user:User,
    savedRecipes:number
}
