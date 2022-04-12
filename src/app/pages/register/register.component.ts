import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthManagementService } from 'src/app/services/auth/auth-management.service';
import { PaymentDetailService } from 'src/app/services/crud/payment-detail.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  faEnvelope = faEnvelope;
  faUser = faUser;
  faLock = faLock;
  constructor(public auth: AuthManagementService, public router: Router) { }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern(/^[a-z]+$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)])
  });

  passStatus = 'Field Required';
  userStatus = 'Field Required';
  emailStatus = 'Field Required';

  get getPass(){
    return this.registerForm.get("password");
  }

  get getEmail(){
    return this.registerForm.get("email");
  }

  get getUsername(){
    return this.registerForm.get("username");
  }

  onRegister = () => {
    if(this.registerForm.valid){
      Swal.showLoading();
      this.auth.register(this.registerForm.value).subscribe(
        res => 
        {
          if(res){
            Swal.fire(
            {
              icon: 'success',
              title: 'Register successfully'
            }
            ).then(
              ()=> {
                this.registerForm.reset()
                this.router.navigate([ 'login' ])
              }
            )
          }
        }, 
        (err) =>
        {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Register Failed',
            text: `${err.error.errors[0]}`
          });   
        });
    }
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.subscribe(val => {
      if(this.registerForm.controls.password.invalid){
        this.passStatus = 'Password must include:'
        let regex = [/[0-9]/, /[a-z]/, /[A-Z]/, /\W/];
        let status = [" 'number' ", " 'lowercase' ", " 'uppercase' ", " 'uniqe char' "]
        
        for(let i = 0; i < regex.length; ++i){
          if(!regex[i].test(val.password)){
            this.passStatus += status[i]
          }
        }
      }
      if(this.registerForm.controls.username){
        this.userStatus = 'Username must lowercase without space'
      }
      if(this.registerForm.controls.email){
        this.emailStatus = 'Email Invalid'
      }

    })
  }

}
