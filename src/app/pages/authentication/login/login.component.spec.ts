import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppSideLoginComponent } from './login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppSideLoginComponent', () => {
  let component: AppSideLoginComponent;
  let fixture: ComponentFixture<AppSideLoginComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let snackBarMock: any;

  beforeEach(async () => {
    authServiceMock = {
      onLogin: jest.fn().mockReturnValue(of({ token: 'fakeToken' })), 
    };
    routerMock = {
      navigateByUrl: jest.fn(),
    };
    snackBarMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [AppSideLoginComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSideLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onLogin method of AuthenticationService', () => {
    component.loginForm.setValue({ email: 'test@gmail.com', password: 'password' });
    component.onLogin();
    expect(authServiceMock.onLogin).toHaveBeenCalledTimes(1);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('dashboard/admin');
  });

  it('should return email error messages correctly', () => {
    const emailControl = component.loginForm.controls['email'];

    // Test for required error
    emailControl.setValue('');
    expect(component.getEmailErrorMessage(emailControl)).toBe('Email is required.');

    // Test for invalid email format
    emailControl.setValue('invalidemail');
    expect(component.getEmailErrorMessage(emailControl)).toBe('Email must be valid.');

    // Test for no errors
    emailControl.setValue('test@gmail.com');
    expect(component.getEmailErrorMessage(emailControl)).toBe('');
  });

  it('should return password error messages correctly', () => {
    const passwordControl = component.loginForm.controls['password'];

    // Test for required error
    passwordControl.setValue('');
    expect(component.getPasswordErrorMessage(passwordControl)).toBe('Password is required.');

    // Test for no errors
    passwordControl.setValue('password');
    expect(component.getPasswordErrorMessage(passwordControl)).toBe('');
  });

  
});
