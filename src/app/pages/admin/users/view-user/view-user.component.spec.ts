import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewUserComponent } from './view-user.component';
import { UserService } from '../../../../../app/core/services/user.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewUserComponent', () => {
  let component: ViewUserComponent;
  let fixture: ComponentFixture<ViewUserComponent>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let userServiceMock: Partial<UserService>;

  beforeEach(async () => {
    activatedRouteMock = {
      params: of({ id: '1' }), 
    };

    userServiceMock = {
      getUsers: jest.fn(() => of([{ id: 1, prenom: 'John', nom: 'Doe', email: 'john@example.com', isActive: true }])), // Mock getUsers method
      updateUser: jest.fn((id, user) => {
        return of(user); // Mock the updateUser method to return an observable
      }), 
    };

    await TestBed.configureTestingModule({
      declarations: [ViewUserComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
