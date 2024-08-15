import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let userService: UserService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ token: 'fakeToken' })
          }
        },
        { provide: Router, useValue: { navigateByUrl: () => {} } },
        { provide: MatSnackBar, useValue: { open: () => {} } },
        { provide: UserService, useValue: { resetPassword: () => of({}) } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and extract token from URL parameters', () => {
    expect(component.resetPasswordForm).toBeTruthy();
    expect(component.token).toEqual('fakeToken');
  });

  it('should return password error message if password is required', () => {
    component.resetPasswordForm.controls['password'].markAsTouched();
    expect(component.getPasswordErrorMessage()).toEqual('Password is required.');
  });

  it('should return confirm password error message if confirm password is required', () => {
    component.resetPasswordForm.controls['confirmPassword'].markAsTouched();
    expect(component.getConfirmPasswordErrorMessage()).toEqual('Confirm Password is required.');
  });

  it('should return confirm password error message if passwords do not match', () => {
    component.resetPasswordForm.controls['password'].setValue('password123');
    component.resetPasswordForm.controls['confirmPassword'].setValue('password456');
    expect(component.getConfirmPasswordErrorMessage()).toEqual('Passwords do not match.');
  });

  it('should return empty string if no error in password', () => {
    component.resetPasswordForm.controls['password'].setValue('Password123!');
    expect(component.getPasswordErrorMessage()).toEqual('');
  });

  it('should return empty string if no error in confirm password', () => {
    component.resetPasswordForm.controls['password'].setValue('Password123!');
    component.resetPasswordForm.controls['confirmPassword'].setValue('Password123!');
    expect(component.getConfirmPasswordErrorMessage()).toEqual('');
  });

});

