import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuActive: boolean = false;
  isAuthorized: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAuthorization();
  }

  toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
  }

  closeMenu() {
    this.isMenuActive = false;
  }

  logout() {
    localStorage.clear();
    this.isAuthorized = false;
    this.router.navigate(['/']);
  }

  private checkAuthorization() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenData: any = jwtDecode(token);
        if (tokenData.exp && tokenData.exp < Date.now() / 1000) {
          // If token is expired, clear localStorage and navigate to sign-in page
          localStorage.clear();
          this.isAuthorized = false;
          this.router.navigate(['/sign-in']);
        } else {
          // If token is valid, set isAuthorized to true
          this.isAuthorized = true;
        }
      } catch (error) {
        // If token is invalid, clear localStorage and navigate to sign-in page
        console.error('Invalid token', error);
        localStorage.clear();
        this.isAuthorized = false;
        this.router.navigate(['/sign-in']);
      }
    }
  }
}
