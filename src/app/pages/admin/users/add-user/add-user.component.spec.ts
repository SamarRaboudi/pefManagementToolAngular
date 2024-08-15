import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserService } from '../../../../core/services/user.service';
import { AddUserComponent } from './add-user.component';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../app/core/models/user.model';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfilService } from '../../../../core/services/profil.service';
import { Profil } from '../../../../../app/core/models/profil.model';

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddUserComponent>>;
  let userServiceMock: Partial<UserService>;
  let profilServiceMock: Partial<ProfilService>;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = { id: 1, nom: 'Test user' }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    profilServiceMock = {
      getProfils: jest.fn(() => of([{ id: 1, titre: 'Test Profil' }] as Profil[])),
    };

    userServiceMock = {
      addUser: jest.fn(() => of(mockUser)), 
      userAdded: new EventEmitter<User>(), 
    };

    await TestBed.configureTestingModule({
      declarations: [ AddUserComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ProfilService, useValue: profilServiceMock }, // Provide mocked ProfilService here
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user form with empty fields', () => {
    expect(component.userForm).toBeInstanceOf(FormGroup);
    expect(component.userForm.controls['email'].value).toEqual('');
    expect(component.userForm.controls['prenom'].value).toEqual('');
    expect(component.userForm.controls['nom'].value).toEqual('');
    expect(component.userForm.controls['profils'].value).toEqual([]);
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should show error messages for required fields', () => {
    const emailControl = component.userForm.controls['email'];
    const prenomControl = component.userForm.controls['prenom'];
    const nomControl = component.userForm.controls['nom'];
    const profilsControl = component.userForm.controls['profils'];

    emailControl.markAsTouched();
    prenomControl.markAsTouched();
    nomControl.markAsTouched();
    profilsControl.markAsTouched();

    fixture.detectChanges();

    expect(component.getEmailErrorMessage(emailControl)).toBe('Email is required.');
    expect(component.getprenomErrorMessage(prenomControl)).toBe('First Name is required.');
    expect(component.getnomErrorMessage(nomControl)).toBe('Last Name is required.');
    expect(component.getprofilErrorMessage(profilsControl)).toBe('Profile is required.');
  });

  it('should retrieve and set profiles on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(profilServiceMock.getProfils).toHaveBeenCalled();
    expect(component.profils.length).toBe(1);
    expect(component.profils[0].titre).toBe('Test Profil');
  }));

});
