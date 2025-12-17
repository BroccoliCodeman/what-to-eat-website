import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { CloudinaryService } from '../services/cloudinary.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css', '../app.component.css']
})
export class UserPageComponent implements OnInit {
  user: any;
  profileForm: FormGroup;
  savedRecipes: any[] = [];
  files: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe((result) => {
      console.log(result)
      this.user = result;
      if (this.user.avatar === 'string') {
        this.user.avatar = null;
      }

      this.profileForm.patchValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName
      });

      if (result) {
        this.authService.getSavedRecipes(this.user.id).subscribe((result) => {
          console.log(result);
          if (result.statusCode === 200) {
            this.savedRecipes = result.data;
          }
        });
      }
      else {
        console.error('Failed to get user or statusCode is not 200');
      }
    });
  }

  goToRecipePage(recipeId: string): void {
    this.router.navigate(['/recipe-page', recipeId]);
  }

  async saveProfile() {
    if (this.profileForm.valid) {
      if (this.files && this.files.length > 0) {
        this.cloudinaryService.uploadMedia(this.files[0]).subscribe({
          next: (imageUrl: string) => {
            console.log('Uploaded successfully! URL:', imageUrl);
            let avatarUrl = imageUrl;
            this.user.avatar = avatarUrl;

            const updatedUser = {
              ...this.profileForm.value,
              avatar: this.user.avatar,
              id: this.user.id,
              email: this.user.email
            };

            console.log(updatedUser)

            this.authService.updateUser(updatedUser).subscribe((result) => {
              if (result.statusCode === 200 || null) {
                alert("Changes is applied successfully!")
              }
              else {
                alert("Something went wrong!");
              }
            });
          },
          error: (err) => {
            console.error('Cloudinary Upload Error:', err);
          }
        });
      }
    }
  }


  onFileChange(event: any): void {
    this.files = event.target.files;
    if (this.files?.length > 0) {
      const file = this.files[0];
      this.user.avatar = URL.createObjectURL(file);
    }
  }
}
