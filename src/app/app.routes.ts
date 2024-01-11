import { Routes } from '@angular/router';
import { FoodComponent } from './components/food/food.component';
import { FoodGroupComponent } from './components/food-group/food-group.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'food', component: FoodComponent },
  { path: 'food-group', component: FoodGroupComponent },
  { path: 'recipe', component: RecipeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
