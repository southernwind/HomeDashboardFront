import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { first } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { WaterState, CurrentWaterState } from '../models/water-state.model';
import { DashboardService } from './dashboard.service';
import { PalmieCourses } from '../models/palmie-course.model';


@Injectable({
  providedIn: "root",
})
export class PalmieApiService {
  constructor(private http: HttpClient) { }
  public GetCourses(): Observable<PalmieCourses> {
    return this.http.get<PalmieCourses>(`${environment.apiUrl}api/palmie-api/get-all-courses`).pipe(first());
  }

  public GetSearchResult(word: string): Observable<PalmieCourses> {
    return this.http.get<PalmieCourses>(`${environment.apiUrl}api/palmie-api/get-courses?word=${word}`).pipe(first());
  }
}
