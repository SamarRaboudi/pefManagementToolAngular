import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InterviewValidationComponent } from './interview-validation.component';

describe('InterviewConfirmationComponent', () => {
  let component: InterviewValidationComponent;
  let fixture: ComponentFixture<InterviewValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InterviewValidationComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
