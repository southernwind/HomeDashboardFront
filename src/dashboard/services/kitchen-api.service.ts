import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { WakeOnLanTarget } from '../models/wake-on-lan-target.model';
import { DhcpLease } from '../models/dhcp-lease.model';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: "root",
})
export class KitchenApiService {
  constructor(private http: HttpClient) { }

  public RegisterRecipe(target: Recipe): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/kitchen-api/post-register-recipe`, target).pipe(first());
  }

  public DeleteRecipe(target: Recipe): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}api/kitchen-api/post-delete-recipe`, target).pipe(first());
  }

  public GetRecipeList(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${environment.apiUrl}api/kitchen-api/get-recipe-list`).pipe(first());
  }
}
