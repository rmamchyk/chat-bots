import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ValidatorHelper } from '../../helpers/ValidatorHelper';
import { AuthService } from '../auth.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
   errors: string[] = [];

   constructor(private authService: AuthService) { }

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
      this.errors = [];
      if (this.loginForm.invalid) {
         ValidatorHelper.validateAllFormFields(this.loginForm); 
         return;
      }
      this.authService.login(this.username.value, this.password.value).subscribe(
         (res) => {
             if (res.errors && res.errors.length > 0) {
               res.errors.forEach(err => {
                  this.errors.push(err);
                });
             }
         },
         (err) => console.log(err)
     );
   }
}
