import { FoodGroup } from "./food-group.model";

export interface Food {
  id: number,
  name: string,
  food_group: FoodGroup
}