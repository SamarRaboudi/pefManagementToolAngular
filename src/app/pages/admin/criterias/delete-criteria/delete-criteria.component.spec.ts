import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteCriteriaComponent } from './delete-criteria.component';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';

describe('DeleteCriteriaComponent', () => {
  let component: DeleteCriteriaComponent;
  let fixture: ComponentFixture<DeleteCriteriaComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteCriteriaComponent>>;
  let criteriaServiceMock: Partial<CriteriaService>;
  let mockCriteria: Criteria;

  beforeEach(async () => {
    mockCriteria = { id: 1, name: 'Test criteria', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    criteriaServiceMock = {
      updateCriteria: jest.fn(() => of(mockCriteria)),
      criteriaAdded: new EventEmitter<Criteria>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ DeleteCriteriaComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockCriteria },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(spyClose).toHaveBeenCalled();
  });

  it('should delete criteria and close dialog on success', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    const spyEmit = jest.spyOn(component.criteriaDeleted, 'emit');
    const spyCriteriaAdded = jest.spyOn(criteriaServiceMock.criteriaAdded!, 'emit'); // add the non-null assertion operator

    component.deleteCriteria();

    expect(criteriaServiceMock.updateCriteria).toHaveBeenCalledWith(mockCriteria.id, {
      name: 'Test criteria',
      value: undefined,
      isActive: false,
      profils: undefined,
    });
    expect(spyCriteriaAdded).toHaveBeenCalledWith(mockCriteria);
    expect(spyClose).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should handle delete criteria failure', () => {
    jest.spyOn(criteriaServiceMock, 'updateCriteria').mockReturnValueOnce(throwError(() => new Error('Failed to update criteria')));
    const spyEmit = jest.spyOn(component.criteriaDeleted, 'emit');

    component.deleteCriteria();

    expect(spyEmit).toHaveBeenCalledWith(false);
  });

  it('should log error and not proceed if criteria is invalid', () => {
    console.error = jest.fn();
    component.criteria = { id: undefined, name: '', isActive: true };
    const spyEmit = jest.spyOn(component.criteriaDeleted, 'emit');

    component.deleteCriteria();

    expect(console.error).toHaveBeenCalledWith('Cannot deactivate criteria: Invalid criteria or ID is missing.');
    expect(spyEmit).not.toHaveBeenCalled();
  });
});
