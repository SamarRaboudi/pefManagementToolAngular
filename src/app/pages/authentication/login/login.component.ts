import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class AppSideLoginComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(
    private authService: AuthenticationService,
    private route: Router,
    private messageService: MessageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  getEmailErrorMessage(emailControl: any): string {
    if (emailControl?.hasError('required')) {
      return 'Email is required.';
    }

    if (emailControl?.hasError('email')) {
      return 'Email must be valid.';
    }

    return '';
  }

  getPasswordErrorMessage(passwordControl: any): string {
    if (passwordControl?.hasError('required')) {
      return 'Password is required.';
    }
    return '';
  }

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onLoginError() {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect email or password. Please try again!' });
   

  }

  onLoginSuccess(res: any) {
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('idUser', res.idUser);
      localStorage.setItem('profiles', JSON.stringify(res.profileTitles));
      this.route.navigateByUrl('dashboard/admin');
    } else {
      this.onLoginError();
    }
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService.onLogin(this.loginForm.value).subscribe(
      (res: any) => {
        this.onLoginSuccess(res);
      },
      error => {
        this.onLoginError();
      }
    );
  }
}