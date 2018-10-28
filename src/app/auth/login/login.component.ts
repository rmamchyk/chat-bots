import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ValidatorHelper } from './../../helpers/ValidatorHelper';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;

   constructor() { }

   ngOnInit() {
      this.loginForm = new FormGroup({
         'username': new FormControl('', [Validators.required, ValidatorHelper.minLength(5)]),
         'password': new FormControl('', [Validators.required, ValidatorHelper.minLength(5)])
      });
   }

   // convenience getter for easy access to form fields
   get username() { return this.loginForm.get('username'); }
   get password() { return this.loginForm.get('password'); }

   onLogin() {
      if (this.loginForm.invalid) {
         ValidatorHelper.validateAllFormFields(this.loginForm); 
         return;
      }
   }
}
