import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private http: HttpClient,private fireStorage:AngularFireStorage) {

   }
   async putToStorage(file:any){
    const path = `photos/${file.name}`
    const uploadTask =await this.fireStorage.upload(path,file)
    const url = await uploadTask.ref.getDownloadURL()
    return url; 
  }
}
