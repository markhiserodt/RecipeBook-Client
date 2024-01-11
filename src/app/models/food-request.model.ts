import { FoodGroup } from "./food-group.model";

export interface FoodRequest {
  id?: number,
  name: string,
  foodGroup: FoodGroup
}