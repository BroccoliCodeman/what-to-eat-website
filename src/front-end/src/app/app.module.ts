import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {RouterModule} from '@angular/router'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordResetFormComponent } from './password-reset-form/password-reset-form.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RecipeCreateComponent } from './recipe-create/recipe-create.component';
import { AuthService } from './services/auth.service';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { FirebaseService } from './services/firebase.service';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    SignInComponent,
    PasswordResetComponent,
    PasswordResetFormComponent,
    MainPageComponent,
    RecipeCreateComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'password-reset', component: PasswordResetComponent },
      { path: 'password-reset-form', component: PasswordResetFormComponent },
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'recipe-create', component:RecipeCreateComponent}
    ]),
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyANn35AMYpOScf91GWmfn9i6t6x6ZY5SAk",
      authDomain: "shopoyisty.firebaseapp.com",
      projectId: "shopoyisty",
      storageBucket: "shopoyisty.appspot.com",
      messagingSenderId: "918933353446",
      appId: "1:918933353446:web:770b0fc919144f1571dc27",
      measurementId: "G-LJDHKL6XQK"
    }),
    AngularFireStorageModule
  ],
  providers: [
    AuthService,
    FirebaseService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
