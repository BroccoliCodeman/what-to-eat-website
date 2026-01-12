import { WeightUnit } from "./weightUnit.interface";

export interface Ingredient{
    quantity?:number,
    name?:string,
    weightUnit?:WeightUnit
}