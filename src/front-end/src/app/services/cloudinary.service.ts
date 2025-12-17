import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // Replace these with your actual details from the Cloudinary Console
  private cloudName = 'dekbvmayl'; 
  private uploadPreset = 'shopoisty'; 

  constructor(private http: HttpClient) {}

  uploadMedia(file: File): Observable<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    
    // Cloudinary expects FormData for uploads
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<any>(url, formData).pipe(
      map(response => response.secure_url) // Returns the HTTPS URL of the uploaded file
    );
  }
}
