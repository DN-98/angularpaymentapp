import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthManagementService } from 'src/app/services/auth/auth-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faEnvelope = faEnvelope;
  faLock = faLock;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, 
      Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)
      // Validators.pattern("a+")
    ])
  })

  rememberMe = new FormControl(false);

  passStatus = 'Field Required';
  emailStatus = 'Field Required';
  
  get getEmail (){
    return this.loginForm.get("email")
  }

  get getPass (){
    return this.loginForm.get("password")
  }

  swalLoginSuccess = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(public authService: AuthManagementService, public router: Router) { 
  }
  
  onLogin = () => {
    if(this.loginForm.valid){
      Swal.showLoading();
      this.authService.login(this.loginForm.value).subscribe(
        res => {
          if(res){
            this.authService.setAuthorizationToken(res.token, res.refreshToken);
            if(this.rememberMe.value)
              localStorage.setItem('userEmail', `${this.loginForm.value.email}`);
            else
              localStorage.removeItem('userEmail');
            this.swalLoginSuccess.fire(
            {
              icon: 'success',
              title: 'Signed in successfully',
              
            }
            ).then(
              ()=> {
                this.loginForm.reset()
                this.router.navigate([ 'dashboard' ])
                History
              }
            )
          }
        },
        (err) => 
        {
          let msg = err.error.errors[0] === 'Invalid login request 2'? 'Password salah' : err.error.errors[0] === 'Invalid login request'? 'Email tidak terdaftar' : 'Invalid Request';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: `${msg}`
          });   
        }
      );   
    }
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(val => {
      if(this.loginForm.controls.password.errors){
        this.passStatus = 'Password must include:'
        let regex = [/[0-9]/, /[a-z]/, /[A-Z]/, /\W/];
        let status = [" 'number' ", " 'lowercase' ", " 'uppercase' ", " 'uniqe char' "]
        
        for(let i = 0; i < regex.length; ++i){
          if(!regex[i].test(val.password)){
            this.passStatus += status[i]
          }
        }
      }
    })
    
    if(this.loginForm.controls.email){
      this.emailStatus = 'Email Invalid'
    }

    if(localStorage.getItem('userEmail')){
      this.loginForm.setValue({
        email: localStorage.getItem('userEmail'),
        password: ''
      })
    }
  }
  

}
