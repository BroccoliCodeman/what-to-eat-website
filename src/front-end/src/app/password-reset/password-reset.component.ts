import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,NgForm, Validators,AbstractControl,ValidatorFn} from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css', "../../assets/styles/authorizationCommon.css"]
})
export class PasswordResetComponent {
  resetform:any;
  errorMessage:string="";

  constructor(private authService:AuthService){
    //resetform
    this.resetform=new FormGroup({
      email:new FormControl('',[
        Validators.required,
        Validators.email
      ])
    });
  }

//pass match validator
createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
  return () => {
  if (controlOne.value !== controlTwo.value)
    return { match_error: 'Value does not match' };
  return null;
};
}

  onSubmit(){
    console.log(this.resetform)
    this.authService.forgotPassword(this.resetform.controls['email'].value)
    .subscribe(
      (res: any) => {
        if (res) {
          this.errorMessage = res.message;
        } else {
          window.alert("Силку для відновлення надіслано на вашу пошту!");
        }
      }
    );
  }
}
