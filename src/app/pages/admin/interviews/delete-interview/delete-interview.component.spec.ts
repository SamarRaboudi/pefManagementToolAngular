import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { DeleteInterviewComponent } from './delete-interview.component';
import { InterviewService } from '../../../../core/services/interview.service';
import { Interview } from '../../../../core/models/interview.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DeleteInterviewComponent', () => {
  let component: DeleteInterviewComponent;
  let fixture: ComponentFixture<DeleteInterviewComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteInterviewComponent>>;
  let interviewServiceMock: Partial<InterviewService>;
  let mockInterview: Interview;

  beforeEach(waitForAsync(() => {
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

    TestBed.configureTestingModule({
      declarations: [DeleteInterviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: InterviewService, useValue: interviewServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockInterview },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });


});
