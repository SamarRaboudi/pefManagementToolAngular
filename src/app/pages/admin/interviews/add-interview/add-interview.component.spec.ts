import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { AddInterviewComponent } from './add-interview.component';
import { InterviewService } from '../../../../core/services/interview.service';
import { CandidateService } from '../../../../core/services/candidate.service';
import { UserService } from '../../../../core/services/user.service';
import { Interview } from '../../../../../app/core/models/interview.model';
import { Candidate } from '../../../../core/models/candidate.model';
import { User } from '../../../../core/models/user.model';

describe('AddInterviewComponent', () => {
  let component: AddInterviewComponent;
  let fixture: ComponentFixture<AddInterviewComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddInterviewComponent>>;
  let interviewServiceMock: Partial<InterviewService>;
  let candidateServiceMock: Partial<CandidateService>;
  let userServiceMock: Partial<UserService>;
  let mockInterview: Interview;
  let mockCandidates: Candidate[];
  let mockUsers: User[];

  beforeEach(async () => {
    mockInterview = {
      id: 1,
      interviewDay: 'day',
      interviewTime: 'time',
      isActive: true,
      candidate: { id: 1, firstName: 'candidate 1' },
      interviewLines: [],
      users: []
    };
    mockCandidates = [{ id: 1, firstName: 'candidate 1' }, { id: 2, firstName: 'candidate 2' }];
    mockUsers = [{ id: 1, nom: 'user 1' }, { id: 2, nom: 'user 2' }];

    matDialogRefMock = {
      close: jest.fn(),
    };

    interviewServiceMock = {
      addInterview: jest.fn(() => of(mockInterview)),
      interviewAdded: new EventEmitter<Interview>(),
    };

    candidateServiceMock = {
      getCandidates: jest.fn(() => of(mockCandidates)),
    };

    userServiceMock = {
      getUsers: jest.fn(() => of(mockUsers)),
    };

    await TestBed.configureTestingModule({
      declarations: [AddInterviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: InterviewService, useValue: interviewServiceMock },
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users and candidates on init', () => {
    component.ngOnInit();
    expect(component.users).toEqual(mockUsers);
    expect(component.candidates).toEqual(mockCandidates);
  });

  it('should add interview when form is valid', () => {
    component.interviewForm.setValue({
      users: [1],
      candidate: 1,
      interviewDay: '2023-01-01',
      interviewTime: '10:00'
    });

    component.addInterview();

    expect(interviewServiceMock.addInterview).toHaveBeenCalledWith({
      candidate: 1,
      interviewDay: '2023-01-01',
      interviewTime: '10:00:00',
      interviewLines: [{ user: 1 }],
      users: [1]
    });
  });

  it('should not add interview when form is invalid', () => {
    component.interviewForm.setValue({
      users: [],
      candidate: '',
      interviewDay: '',
      interviewTime: ''
    });

    component.addInterview();

    expect(interviewServiceMock.addInterview).not.toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
