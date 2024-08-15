import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CandidateService } from '../../../../core/services/candidate.service';
import { CandidateComponent } from './candidate.component';
import { of } from 'rxjs';

// Define a mock candidateService
class MockcandidateService {
  getCandidates = jest.fn(() => of([])); 
  candidateAdded = new EventEmitter<any>();
}


describe('candidateComponent', () => {
  let component: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;
  let candidateServiceMock: MockcandidateService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    candidateServiceMock = new MockcandidateService(); 

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CandidateComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getcandidates on initialization', () => {
    expect(candidateServiceMock.getCandidates).toHaveBeenCalled();
  });

  it('should handle candidateAdded event', () => {
    const newcandidate = { id: 1, firstName: 'Test firstName',lastName: 'Test lastName',email: 'Testemail@gmail.com', isActive: true };
    candidateServiceMock.candidateAdded.emit(newcandidate);
    expect(candidateServiceMock.getCandidates).toHaveBeenCalled();
  });

 
});
