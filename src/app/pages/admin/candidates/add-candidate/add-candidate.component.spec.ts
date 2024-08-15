import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AddCandidateComponent } from './add-candidate.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CandidateService } from '../../../../core/services/candidate.service';
import { of } from 'rxjs';
import { Candidate } from 'src/app/core/models/candidate.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddcandidateComponent', () => {
  let component: AddCandidateComponent;
  let fixture: ComponentFixture<AddCandidateComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddCandidateComponent>>;
  let candidateServiceMock: Partial<CandidateService>;
  let mockcandidate: Candidate;

  beforeEach(() => {
    mockcandidate = { id: 1, firstName: 'Test firstName', lastName: 'Test lastName', email: 'Testemail@gmail.com' };

    matDialogRefMock = {
      close: jest.fn(),
    };

    candidateServiceMock = {
      addCandidate: jest.fn(() => of(mockcandidate)),
      candidateAdded: new EventEmitter<Candidate>(),
    };

    TestBed.configureTestingModule({
      declarations: [AddCandidateComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CandidateService, useValue: candidateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize candidate form with empty firstName', () => {
    expect(component.candidateForm).toBeInstanceOf(FormGroup);
    expect(component.candidateForm.controls['firstName'].value).toEqual('');
    expect(component.candidateForm.controls['lastName'].value).toEqual('');
    expect(component.candidateForm.controls['email'].value).toEqual('');
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
 
});
