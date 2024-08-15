import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewComponent } from './interview.component';
import { MatDialog } from '@angular/material/dialog';
import { InterviewService } from '../../../../core/services/interview.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

class MockinterviewService {
  getInterviews = jest.fn(() => of([]));
  interviewAdded = new EventEmitter<any>();
}

describe('InterviewComponent', () => {
  let component: InterviewComponent;
  let fixture: ComponentFixture<InterviewComponent>;
  let interviewServiceMock: MockinterviewService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    interviewServiceMock = new MockinterviewService(); 

    matDialogMock = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [ InterviewComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: InterviewService, useValue: interviewServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
