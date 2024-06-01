import { Component } from '@angular/core';
import {FormGroup,FormControl,Validators,AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.component.html',
  styleUrls: ['./password-reset-form.component.css', "../../assets/styles/authorizationCommon.css"]
})
export class PasswordResetFormComponent {
  passresetform:any;
  errorMessage:string="";

  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute,private router:Router){
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
  //pass match validator
createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
  return () => {
  if (controlOne.value !== controlTwo.value)
    return { match_error: 'Value does not match' };
  return null;
};
}

  onSubmit(){
    let id=this.activatedRoute.snapshot.paramMap.get('id')as string || '';
    let code=this.activatedRoute.snapshot.paramMap.get('code')as string || '';

    this.authService.resetPassword(id,code,this.passresetform.controls['passwordreset'].value)
    .subscribe(
      (res: any) => {
        if (res) {
          this.errorMessage = "Ви не маєте доступу до цього!";
        } else {
          this.router.navigateByUrl("/sign-in");
        }
      }
    );;
  }
}
