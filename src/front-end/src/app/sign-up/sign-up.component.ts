import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,NgForm, Validators,AbstractControl,ValidatorFn} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../../assets/styles/avatar.scss', "../../assets/styles/authorizationCommon.css"]
})
export class SignUpComponent {

  reggform:any;

  files:any;

  errorMessage:string="";

  constructor(private authService:AuthService,private router:Router,private firebaseService:FirebaseService){

    //reg form
    this.reggform=new FormGroup({
      email:new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      file:new FormControl('',[
      ]),
      passwordreg:new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
        )
      ]),
      passwordrepeat:new FormControl('',[
        Validators.required
      ]),
      surname:new FormControl('',[
        Validators.required
      ]),
      firstname:new FormControl('',[
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

  //reg form pass visibility
  toggleregPasswordVisibility(): void {
    const passwordInput = document.querySelector('input[name="passwordreg"]') as HTMLInputElement;
    const toggleImg = document.getElementById('toggleregPassword') as HTMLImageElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleImg.src = '../../assets/images/togglepassword2.png';
    } else {
      passwordInput.type = 'password';
      toggleImg.src = '../../assets/images/togglepassword1.png';
    }
  }
  //reg form passrepeat visibility
  toggleregPasswordrepeatVisibility(): void {
    const passwordInput = document.querySelector('input[name="passwordrepeat"]') as HTMLInputElement;
    const toggleImg = document.getElementById('toggleregrepeatPassword') as HTMLImageElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleImg.src = '../../assets/images/togglepassword2.png';
    } else {
      passwordInput.type = 'password';
      toggleImg.src = '../../assets/images/togglepassword1.png';
    }
  }
  //passreset form passreset visibillity
  toggleresetPasswordVisibility(): void {
    const passwordInput = document.querySelector('input[name="passwordreset"]') as HTMLInputElement;
    const toggleImg = document.getElementById('toggleresetPassword') as HTMLImageElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleImg.src = '../../assets/images/togglepassword2.png';
    } else {
      passwordInput.type = 'password';
      toggleImg.src = '../../assets/images/togglepassword1.png';
    }
  }
  //passreset form passresetrepeat visibillity
  toggleresetrepeatPasswordVisibility(): void {
    const passwordInput = document.querySelector('input[name="passwordresetrepeat"]') as HTMLInputElement;
    const toggleImg = document.getElementById('toggleresetrepeatPassword') as HTMLImageElement;

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleImg.src = '../../assets/images/togglepassword2.png';
    } else {
      passwordInput.type = 'password';
      toggleImg.src = '../../assets/images/togglepassword1.png';
    }
  }
  //reg form avatar
  onFileChange(event: any) {
    this.files = event.target.files as FileList;

    if (this.files.length > 0) {
      const _file = URL.createObjectURL(this.files[0]);
      this.reggform.file = _file;
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

async onRegister() {
  if (this.reggform.invalid) {
    this.errorMessage = 'Please fill in all fields correctly.';
    return;
  }
  let avatar='../../assets/images/avatar-placeholder.png'
  if(this.files!=null){
    avatar=await this.firebaseService.putToStorage(this.files[0]);
    console.log(avatar);
  }

  this.authService.registerUser(
    this.reggform.controls['email'].value,
    this.reggform.controls['firstname'].value,
    avatar,
    this.reggform.controls['surname'].value,
    this.reggform.controls['passwordreg'].value,
    this.reggform.controls['passwordrepeat'].value
  ).subscribe(
    (res: any) => {
      if (res) {
        this.errorMessage = "Користувач з такою поштою вже існує у базі!";
      } else {
        this.router.navigate(['/sign-in']);
      }
    }
  );
}
}
