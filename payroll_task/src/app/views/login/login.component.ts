import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private router:Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['',  Validators.compose([Validators.required])],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    const data = this.loginForm.value;
    this.authService.login(data).subscribe({
      next: (res:any) => {
        if (res.success === true) {
          this.toaster.success('User Login Successfully');
          localStorage.setItem("referraltoken", res.referralToken);
          localStorage.setItem('userDetails',res.userDetail);
          this.router.navigate(['/mytask']); 
        } else {
          this.toaster.error('Invalid Credentials');
        }
      },
      error: () => {
        this.toaster.error('Something went wrong. Please try again.');
      },
    });
  }
}
