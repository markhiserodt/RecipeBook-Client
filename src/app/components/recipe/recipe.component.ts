import { Component, ElementRef, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { RecipeService } from '../../services/recipe/recipe.service';
import { Recipe } from '../../models/recipe.model';
import { Food } from '../../models/food.model';
import { take } from 'rxjs';
import { FoodService } from '../../services/food/food.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecipeRequest } from '../../models/recipe-request.model';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent implements OnInit {
  recipeService = inject(RecipeService);
  foodService = inject(FoodService);

  @ViewChild('closeEditRecipeModalButton') closeEditRecipeModalButton?: ElementRef;

  recipes: Signal<Recipe[]> = this.recipeService.recipes.asReadonly();
  foods: Signal<Food[]> = this.foodService.foods.asReadonly();

  recipeName = '';
  selectedFoods: Food[] = [];

  recipeEdit?: Recipe;

  ngOnInit(): void {
    // this.getRecipes();
    // this.getFoods();
  }

  editFood(selectedFood: Food): void {
    let index = -1;
    this.recipeEdit!.foods.forEach((food, i) => {
      if (food.id === selectedFood.id) {
        index = i;
        return;
      }
    });
    if (index > -1) {
      this.recipeEdit!.foods.splice(index, 1);
    } else {
      this.recipeEdit!.foods.push(selectedFood);
    }
  }

  selectFood(food: Food): void {
    const index = this.selectedFoods.indexOf(food);
    if (index > -1) {
      this.selectedFoods.splice(index, 1);
    } else {
      this.selectedFoods.push(food);
    }
  }

  addRecipe(): void {
    const recipeRequest: RecipeRequest = {
      name: this.recipeName,
      food_ids: this.selectedFoods.map(food => {
        return food.id
      })
    }
    this.recipeService.addRecipe(recipeRequest).pipe(take(1)).subscribe({
      next: (recipe: Recipe) => {
        this.recipes().push(recipe);
      }
    });
  }

  editRecipe(recipe: Recipe): void {
    this.recipeEdit = JSON.parse(JSON.stringify(recipe));
  }

  deleteRecipe(id: number, index: number): void {
    this.recipeService.deleteRecipe(id).pipe(take(1)).subscribe({
      next: () => {
        this.recipes().splice(index, 1);
      }
    });
  }

  isEditFoodSelected(selectedFood: Food): boolean {
    let found = false;
    this.recipeEdit!.foods.forEach(food => {
      if (food.id === selectedFood.id) {
        found = true;
        return;
      }
    });
    return found;
  }

  updateRecipe(recipe: Recipe): void {
    const recipeRequest: RecipeRequest = {
      id: recipe.id,
      name: recipe.name,
      food_ids: recipe.foods.map(food => {
        return food.id
      })
    }
    this.recipeService.updateRecipe(recipeRequest).pipe(take(1)).subscribe({
      next: (updatedRecipe: Recipe) => {
        let recipeToUpdate = this.recipes().find((recipe: Recipe) => {
          return recipe.id === updatedRecipe.id;
        });
        if (recipeToUpdate) {
          Object.assign(recipeToUpdate, updatedRecipe);
          this.closeEditRecipeModalButton?.nativeElement.click();
        }
      }
    });
  }

  // private getRecipes(): void {
  //   this.recipeService.getRecipes().pipe(take(1)).subscribe({
  //     next: (recipes: Recipe[]) => {
  //       this.recipes = recipes;
  //     }
  //   });
  // }

  // private getFoods(): void {
  //   this.foodService.getFood().pipe(take(1)).subscribe({
  //     next: (foods) => {
  //       this.foods = foods;
  //     }
  //   });
  // }
}
