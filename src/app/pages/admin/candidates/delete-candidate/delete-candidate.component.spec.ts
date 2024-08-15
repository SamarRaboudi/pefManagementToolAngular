import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DeleteCandidateComponent } from './delete-candidate.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from '../../../../core/services/candidate.service';
import { of } from 'rxjs';
import { Candidate } from '../../../../../app/core/models/candidate.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('deletecandidateComponent', () => {
  let component: DeleteCandidateComponent;
  let fixture: ComponentFixture<DeleteCandidateComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteCandidateComponent>>;
  let candidateServiceMock: Partial<CandidateService>;
  let mockcandidate: Candidate;

  beforeEach(() => {
    mockcandidate = { id: 1, firstName: 'Test firstName',lastName: 'Test lastName',email: 'Testemail@gmail.com', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    candidateServiceMock = {
      updateCandidate: jest.fn(() => of(mockcandidate)),
      candidateAdded: new EventEmitter<Candidate>(),
    };

    TestBed.configureTestingModule({
      declarations: [DeleteCandidateComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockcandidate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCandidateComponent);
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

  it('should emit candidateAdded event when deletecandidate method is called', fakeAsync(() => {
  
    const emitSpy = jest.spyOn(component['candidateService'].candidateAdded, 'emit'); 
  
    component.deleteCandidate();
  
    tick();
  
    expect(candidateServiceMock.updateCandidate).toHaveBeenCalledWith(mockcandidate.id, {
      firstName: 'Test firstName',
      lastName: 'Test lastName',
      email: 'Testemail@gmail.com',
      isActive: false,
    });
  
    if (component['candidateService'].candidateAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
