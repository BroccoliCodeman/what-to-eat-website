import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetFormComponent } from './password-reset-form/password-reset-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    SignInComponent,
    PasswordResetComponent,
    PasswordResetFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
