import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  hideP = true;
  hideCP = true;
  confirmFocused = false;
  token: string;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private messageService: MessageService,) {}

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, this.passwordValidator()]),
      confirmPassword: new FormControl('', [Validators.required, this.matchPasswordValidator('password')])
    });
     // Extract token from URL parameters
     this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  getPasswordErrorMessage() {
    const passwordControl = this.resetPasswordForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required.';
    }
    return '';
  }

  getConfirmPasswordErrorMessage() {
    const confirmPasswordControl = this.resetPasswordForm.get('confirmPassword');
    if (confirmPasswordControl?.hasError('required')) {
      return 'Confirm Password is required.';
    } else if (confirmPasswordControl?.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  passwordValidator(): ValidatorFn { // Return type changed to ValidatorFn
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      if (!value) {
        return null;
      }
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const hasMinLength = value.length >= 8;
      
      const isValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar && hasMinLength;
      
      return isValid ? null : { passwordRequirements: true };
    };
  }

  matchPasswordValidator(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.root.get(matchTo);
      return password && control.value !== password.value ? { passwordMismatch: true } : null;
    };
  }

  get password(): FormControl {
    return this.resetPasswordForm.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.resetPasswordForm.get('confirmPassword') as FormControl;
  }
    
  togglePasswordVisibility(): void {
    this.hideP = !this.hideP;
  }
  toggleCPasswordVisibility(): void {
    this.hideCP = !this.hideCP;
  }

  onFocusConfirmPassword(): void { 
    this.confirmFocused = true;
  }

  onBlurConfirmPassword(): void {
    this.confirmFocused = false;

}
  resetPassword() {
    const newPassword = this.resetPasswordForm.value.password;
    this.userService.resetPassword(this.token, newPassword).subscribe(
      () => {
        this.router.navigateByUrl('authentication/login');
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong. Please try again!' });
      }
    );
  }

}

