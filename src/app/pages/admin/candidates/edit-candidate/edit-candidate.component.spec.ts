import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { EditCandidateComponent } from './edit-candidate.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CandidateService } from '../../../../core/services/candidate.service';
import { of } from 'rxjs';
import { Candidate } from '../../../../../app/core/models/candidate.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditcandidateComponent', () => {
  let component: EditCandidateComponent;
  let fixture: ComponentFixture<EditCandidateComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditCandidateComponent>>;
  let candidateServiceMock: Partial<CandidateService>;
  let mockcandidate: Candidate;

  beforeEach(() => {
    mockcandidate = { id: 1, firstName: 'test',lastName: 'test',email: 'test@gmail.com', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    candidateServiceMock = {
      updateCandidate: jest.fn(() => of(mockcandidate)),
      candidateAdded: new EventEmitter<Candidate>(),
    };

    TestBed.configureTestingModule({
      declarations: [EditCandidateComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockcandidate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize candidate form with candidate data', () => {
    expect(component.candidateForm).toBeInstanceOf(FormGroup);
    expect(component.candidateForm.controls['firstName'].value).toEqual(mockcandidate.firstName);
    expect(component.candidateForm.controls['lastName'].value).toEqual(mockcandidate.lastName);
    expect(component.candidateForm.controls['email'].value).toEqual(mockcandidate.email);
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should emit candidateAdded event when editcandidate method is called', fakeAsync(() => {
    component.candidateForm = new FormGroup({
      firstName: new FormControl('Updated candidate firstName', [Validators.required]),
      lastName: new FormControl('Updated candidate lastName', [Validators.required]),
      email: new FormControl('Updated candidate email', [Validators.required]),
    });
  
    const emitSpy = jest.spyOn(component['candidateService'].candidateAdded, 'emit'); 
  
    component.editCandidate();
  
    tick();
  
    expect(candidateServiceMock.updateCandidate).toHaveBeenCalledWith(mockcandidate.id, {
      firstName: 'Updated candidate firstName',
      lastName: 'Updated candidate lastName',
      email: 'Updated candidate email',
      isActive: true,
    });
  
    if (component['candidateService'].candidateAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
