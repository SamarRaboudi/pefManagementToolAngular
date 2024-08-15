import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../../../core/services/user.service';
import { DeleteUserComponent } from './delete-user.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../app/core/models/user.model';

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteUserComponent>>;
  let userServiceMock: Partial<UserService>;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = { id: 1, nom: 'Test user', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    userServiceMock = {
      updateUser: jest.fn(() => of(mockUser)),
      userAdded: new EventEmitter<User>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ DeleteUserComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockUser },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
