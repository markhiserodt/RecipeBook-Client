import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject, signal } from '@angular/core';
import { RecipeRequest } from '../../models/recipe-request.model';
import { Observable, take } from 'rxjs';
import { Recipe } from '../../models/recipe.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);

  readonly recipes = signal<Recipe[]>([]);

  constructor(@Inject('BASE_URL') private baseUrl: string) {
    this.getRecipes();
  }

  addRecipe(recipeRequest: RecipeRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl + 'api/recipe'}`, recipeRequest);
  }

  getRecipes(): void {
    if (this.recipes().length > 0) return;
    this.http.get<Recipe[]>(`${environment.apiUrl + 'api/recipe'}`).pipe(take(1)).subscribe({
      next: (recipes: Recipe[]) => {
        this.recipes.set(recipes);
      }
    });
  }

  updateRecipe(recipeRequest: RecipeRequest): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl + 'api/recipe'}`, recipeRequest);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl + 'api/recipe/' + id}`);
  }
}
