import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { of } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { CriteriaService } from '../../../core/services/criteria.service'; 
import { AccountComponent } from './account.component';
import { User } from '../../../core/models/user.model';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let userServiceMock: Partial<UserService>;
  let criteriaServiceMock: Partial<CriteriaService>; 
  let snackBarMock: Partial<MatSnackBar>;
  let routerMock: Partial<Router>;
  let messageServiceMock: Partial<MessageService>;

  beforeEach(waitForAsync(() => {
    userServiceMock = {
      getUserByEmail: jest.fn(() => of({ userDetails: { userPicture: 'mockPicture' }, projects: [] } as User)),
      updateUser: jest.fn(() => of({})),
      updatePassword: jest.fn(() => of({})),
      uploadUserPicture: jest.fn(() => of('')),
    };
  
    criteriaServiceMock = {
      getCriterias: jest.fn(() => of([])),
    };
  
    snackBarMock = {
      open: jest.fn(),
    };
  
    routerMock = {
      navigate: jest.fn(),
    };
  
    messageServiceMock = {
      add: jest.fn(),
    };
  
    TestBed.configureTestingModule({
      declarations: [AccountComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: Router, useValue: routerMock },
        { provide: MessageService, useValue: messageServiceMock },
      ],
    }).compileComponents();
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 
});
