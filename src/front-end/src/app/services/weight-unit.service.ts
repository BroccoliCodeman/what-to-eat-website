import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeightUnitService {
  private apiUrl = 'http://localhost:5000/api/WeightUnit/Get';

  constructor(private http: HttpClient) {}

  getWeightUnits(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}