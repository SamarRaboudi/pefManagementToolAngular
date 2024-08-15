import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewService } from '../../../../core/services/interview.service';
import { EditInterviewComponent } from './edit-interview.component';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Interview } from '../../../../../app/core/models/interview.model';
import { HttpClientModule } from '@angular/common/http';

describe('EditInterviewComponent', () => {
  let component: EditInterviewComponent;
  let fixture: ComponentFixture<EditInterviewComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditInterviewComponent>>;
  let interviewServiceMock: Partial<InterviewService>;
  let mockInterview: Interview;

  beforeEach(async () => {
    mockInterview = {
      id: 1,
      interviewDay: '2023-01-01',
      interviewTime: '10:00',
      isActive: true,
      candidate: { id: 1, firstName: 'candidate 1' },
      users: [1]
    };

    matDialogRefMock = {
      close: jest.fn(),
    };

    interviewServiceMock = {
      updateInterview: jest.fn(() => of(mockInterview)),
      interviewAdded: new EventEmitter<Interview>(),
    };

    await TestBed.configureTestingModule({
      declarations: [EditInterviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: InterviewService, useValue: interviewServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockInterview },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
