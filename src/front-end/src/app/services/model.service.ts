import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PredictionResponse } from '../interfaces/predictionResponse.interface';
import { PoolResponse, FeedbackRequest, FeedbackResponse, RetrainResponse, ClassListResponse } from '../interfaces/active-learning.interface';
import { ModelStatus } from '../interfaces/model-status.interface';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  // Зміни порт на той, де запущено main.py (зазвичай 8000 або 1489)
  private apiUrl = 'http://localhost:1489'; 

  constructor(private httpClient: HttpClient) { }

  // --- Inference ---
  uploadImage(file: File): Observable<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<PredictionResponse>(`${this.apiUrl}/predict`, formData);
  }

  // --- Active Learning ---
  
  // Отримати список "сумнівних" фото
  getUncertainPool(limit: number = 20): Observable<PoolResponse> {
    return this.httpClient.get<PoolResponse>(`${this.apiUrl}/active-learning/pool?limit=${limit}`);
  }

  // Відправити правильну мітку (Feedback)
  submitFeedback(imageId: string, correctLabel: string): Observable<FeedbackResponse> {
    const body: FeedbackRequest = {
      image_id: imageId,
      correct_label: correctLabel
    };
    return this.httpClient.post<FeedbackResponse>(`${this.apiUrl}/feedback`, body);
  }

  // Запустити донавчання
  triggerRetraining(): Observable<RetrainResponse> {
    return this.httpClient.post<RetrainResponse>(`${this.apiUrl}/retrain/trigger`, {});
  }

  // Отримати список класів (для випадаючого списку)
  getClasses(): Observable<ClassListResponse> {
    return this.httpClient.get<ClassListResponse>(`${this.apiUrl}/classes`);
  }

  // Допоміжний метод для побудови повного URL картинки
  getImageUrl(relativePath: string): string {
    if (relativePath.startsWith('http')) return relativePath;
    // Видаляємо зайвий слеш на початку, якщо є
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    return `${this.apiUrl}/${cleanPath}`;
  }
  getModelStatus(): Observable<ModelStatus> {
  return this.httpClient.get<ModelStatus>(`${this.apiUrl}/model/status`);
}
}