import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectedIngredient } from '../interfaces/selectedIngredient.interface';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private httpClient:HttpClient) { }

  uploadImage(file: File): Observable<SelectedIngredient> {
        const formData = new FormData();
        formData.append('file', file);
    
        return this.httpClient.post<SelectedIngredient>("http://127.0.0.1:8000/upload-image/", formData);
      }
}
