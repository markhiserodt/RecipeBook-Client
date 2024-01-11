import { Component, ElementRef, Signal, ViewChild, inject } from '@angular/core';
import { take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food/food.service';
import { Food } from '../../models/food.model';
import { FoodRequest } from '../../models/food-request.model';
import { FoodGroup } from '../../models/food-group.model';
import { FoodGroupService } from '../../services/food-group/food-group.service';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './food.component.html',
  styleUrl: './food.component.scss'
})
export class FoodComponent {
  foodService = inject(FoodService);
  foodGroupService = inject(FoodGroupService);

  @ViewChild('closeEditFoodModalButton') closeEditFoodModalButton?: ElementRef;

  foods: Signal<Food[]> = this.foodService.foods.asReadonly();
  foodGroups: Signal<FoodGroup[]> = this.foodGroupService.foodGroups.asReadonly();

  foodName = '';
  foodGroupId = 0;
  foodEdit?: Food;

  addFood(name: string, foodGroupId: number): void {
    const foodRequest: FoodRequest = {
      name: name,
      foodGroup: {
        id: foodGroupId,
        name: ''
      }
    };
    this.foodService.addFood(foodRequest).pipe(take(1)).subscribe({
      next: (food) => {
        this.foods().push(food);
      }
    });
  }

  deleteFood(id: number, index: number): void {
    this.foodService.deleteFood(id).pipe(take(1)).subscribe({
      next: () => {
        this.foods().splice(index, 1);
      }
    });
  }

  editFood(food: Food): void {
    this.foodEdit = Object.assign({}, food);
  }

  updateFood(foodUpdate: Food): void {
    const foodRequest: FoodRequest = {
      id: foodUpdate.id,
      name: foodUpdate.name,
      foodGroup: {
        id: foodUpdate.food_group.id,
        name: ''
      }
    };
    this.foodService.updateFood(foodRequest).pipe(take(1)).subscribe({
      next: (updatedFood) => {
        let foodToUpdate = this.foods().find((food: Food) => {
          return food.id === updatedFood.id;
        });
        if (foodToUpdate) {
          Object.assign(foodToUpdate, updatedFood);
          this.closeEditFoodModalButton?.nativeElement.click();
        }
      }
    });
  }
  
}
