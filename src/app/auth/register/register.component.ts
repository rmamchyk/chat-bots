import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { ValidatorHelper } from './../../helpers/ValidatorHelper';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private authService: AuthService) { }

  ngOnInit() {
     this.registerForm = new FormGroup({
        'username': new FormControl('', [Validators.required, ValidatorHelper.minLength(5)]),
        'email': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required, ValidatorHelper.minLength(5)])
     });
  }

  // convenience getter for easy access to form fields
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get email() { return this.registerForm.get('email'); }

  onRegister() {
     if (this.registerForm.invalid) {
        ValidatorHelper.validateAllFormFields(this.registerForm); 
        return;
     }
     this.authService.register(this.username.value, this.email.value, this.password.value);
  }
}
