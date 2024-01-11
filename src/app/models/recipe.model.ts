import { Food } from "./food.model";

export interface Recipe {
  id: number,
  name: string,
  foods: Food[]
}