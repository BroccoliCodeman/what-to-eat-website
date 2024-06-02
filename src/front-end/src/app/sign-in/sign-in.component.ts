import { Component,NgZone,OnInit } from '@angular/core';
import {FormGroup,FormControl,NgForm, Validators,AbstractControl,ValidatorFn} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CredentialResponse,PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', "../../assets/styles/authorizationCommon.css"]
})
export class SignInComponent {

  loginform:any;

  authorizeerror:boolean=false;
  errorMessage: string = '';

  constructor(private authService:AuthService,private router:Router, private nfZone:NgZone){
    //loginform
    this.loginform=new FormGroup({
      email:new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      password:new FormControl('',[
        Validators.required
      ])
    });
  }


  //login form pass visibility
  togglePasswordVisibility(): void {
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    const toggleImg = document.getElementById('togglePassword') as HTMLImageElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleImg.src = '../../assets/images/togglepassword2.png';
    } else {
      passwordInput.type = 'password';
      toggleImg.src = '../../assets/images/togglepassword1.png';
    }
  }

  //pass match validator
createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
  return () => {
  if (controlOne.value !== controlTwo.value)
    return { match_error: 'Value does not match' };
  return null;
};
}

  submitForm(){
    this.authService.logInUser(
      this.loginform.controls['email'].value,
      this.loginform.controls['password'].value
    ).subscribe(
      (res: any) => {
        if (res.error) {
          this.authorizeerror = true;
          this.errorMessage = res.message;
        } else {
          localStorage.setItem('token', res.token);
          this.router.navigateByUrl('/');
        }
      }
    );
  }


}

