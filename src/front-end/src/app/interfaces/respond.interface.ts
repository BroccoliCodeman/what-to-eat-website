import { User } from "./user.interface";

export interface Respond{
    id:string,
    text:string,
    rate:number,
    recipeId:string,
    userId:string,
    user:User
}