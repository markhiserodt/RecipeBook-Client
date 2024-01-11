import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject, signal } from '@angular/core';
import { FoodGroupRequest } from '../../models/food-group-request.model';
import { Observable, take } from 'rxjs';
import { FoodGroup } from '../../models/food-group.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoodGroupService {
  private http = inject(HttpClient);

  readonly foodGroups = signal<FoodGroup[]>([]);

  constructor(@Inject('BASE_URL') private baseUrl: string) {
    this.getFoodGroups();
  }

  addFoodGroup(foodGroupRequest: FoodGroupRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl + 'api/foodGroup'}`, foodGroupRequest);
  }

  getFoodGroups(): void {
    if (this.foodGroups().length > 0) return;
    this.http.get<FoodGroup[]>(`${environment.apiUrl + 'api/foodGroup'}`).pipe(take(1)).subscribe({
      next: (foodGroups: FoodGroup[]) => {
        this.foodGroups.set(foodGroups);
      }
    });
  }

  updateFoodGroup(foodGroupRequest: FoodGroupRequest): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl + 'api/foodGroup'}`, foodGroupRequest);
  }

  deleteFoodGroup(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl + 'api/foodGroup/' + id}`);
  }
}
