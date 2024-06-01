import { Component,OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  user:any;

  constructor(private authService:AuthService,private router:Router){

  }

  ngOnInit(): void {
    if(localStorage.getItem('token')===null){
      this.router.navigate(['/authpage']);
    }

    this.authService.getUser().subscribe((result) => {
      this.user = result;
    });
}

exitUser(){
  localStorage.clear();
  this.router.navigate(['/']);
}
}
