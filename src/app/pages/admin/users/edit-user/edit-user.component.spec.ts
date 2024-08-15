import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserService } from '../../../../core/services/user.service';
import { EditUserComponent } from './edit-user.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../app/core/models/user.model';
import { HttpClientModule } from '@angular/common/http';

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditUserComponent>>;
  let userServiceMock: Partial<UserService>;
  let mockUser: User;
  beforeEach(async () => {
    mockUser = { id: 1, nom: 'Test Session', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    userServiceMock = {
      updateUser: jest.fn(() => of(mockUser)),
      userAdded: new EventEmitter<User>(),
    };
    await TestBed.configureTestingModule({
      declarations: [ EditUserComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockUser },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
