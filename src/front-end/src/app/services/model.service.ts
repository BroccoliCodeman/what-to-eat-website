import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictionResponse } from '../interfaces/predictionResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private httpClient:HttpClient) { }

  uploadImage(file: File): Observable<PredictionResponse> {
        const formData = new FormData();
        formData.append('file', file);
    
        return this.httpClient.post<PredictionResponse>("http://localhost:1489/predict", formData);
      }
}
