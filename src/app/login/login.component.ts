import { Router } from '@angular/router';
import { LoginService } from './../servicios/login/login.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import * as crypto from 'crypto-js';

import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginData: any;
  loginAuth: boolean;
  loginSend: boolean = false;
  loading: boolean = false;
  x='Hola';
  en;
  bdbytes;
  bd;

  constructor(private loginService: LoginService,
              private formBuilder: FormBuilder,
              private router: Router,
              public afAuth: AngularFireAuth) {
              this.en  = crypto.AES.encrypt(this.x,"meraki");
              this.bdbytes = crypto.AES.decrypt(this.en,"meraki");
              this.bd = this.bdbytes.toString(crypto.enc.Utf8);

  }

  ngOnInit() {

    this.loginService.currentLoginAuth.subscribe(res => {
      this.loginAuth = res;
    });

    this.loginService.currentLoginSend.subscribe(res => {
      this.loginSend = res;
    });

    this.loginService.currentLoading.subscribe(res => {
      this.loading = res;
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      userpassword: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]]
    });
    
  }

  onSubmit() {
    this.loginSend = false; 
    this.loginData = this.saveLoginForm();
    
    //<- TESTING
    this.afAuth.auth.createUserWithEmailAndPassword(this.loginForm.get('username').value, this.loginForm.get('userpassword').value)
    .catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if(errorCode = 'auth/weak-password'){
        console.log('The password is too weak');
      }else{
        console.log(errorMessage);
      }
      console.log(error);
    });
    //TESTING ->
  }

  saveLoginForm() {

    this.loginService.checkLogin(this.loginForm.get('username').value,
                                 this.loginForm.get('userpassword').value); 
    this.loginService.queryLoading(true);
  }
}
