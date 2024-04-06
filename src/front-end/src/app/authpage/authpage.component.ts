import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,NgForm, Validators,AbstractControl,ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-authpage',
  templateUrl: './authpage.component.html',
  styleUrls: ['./authpage.component.css','./avatar.scss']
})
export class AuthpageComponent {

  loginform:any;
  resetform:any;
  reggform:any;
  passresetform:any;

  constructor(){
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
    //resetform
    this.resetform=new FormGroup({
      email:new FormControl('',[
        Validators.required,
        Validators.email
      ])
    });
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
    //pass-reset-form
    this.passresetform=new FormGroup({
      passwordreset:new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
        )
      ]),
      passwordresetrepeat:new FormControl('',[
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
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const _file = URL.createObjectURL(files[0]);
      this.reggform.file = _file;
      this.resetInput();   
    }
 }
 resetInput(){
  const input = document.getElementById('avatar-input-file') as HTMLInputElement;
  if(input){
    input.value = "";
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
}
