import { Component,OnInit } from '@angular/core';
import {FormGroup,FormControl,NgForm, Validators,AbstractControl,ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css', "../../assets/styles/authorizationCommon.css"]
})
export class PasswordResetComponent {
  resetform:any;
  passresetform:any;

  constructor(){
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
}
