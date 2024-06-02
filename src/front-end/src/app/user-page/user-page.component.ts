import { Component,OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css', '../app.component.css']
})
export class UserPageComponent implements OnInit {
  user: any;
  profileForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      newPassword: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    // Fetch user data
    this.authService.getUser().subscribe((result) => {
      this.user = result;
      if (this.user.avatar === "string") {
        this.user.avatar = null;
      }
      this.profileForm.patchValue({
        firstName: this.user?.firstName,
        lastName: this.user?.lastName
      });
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      // Save profile logic
      // this.authService.updateUser(this.profileForm.value).subscribe(() => {
      //   alert('Profile updated successfully!');
      // });
    }
  }

  changeAvatar(): void {
    // Logic to change avatar
  }
}
