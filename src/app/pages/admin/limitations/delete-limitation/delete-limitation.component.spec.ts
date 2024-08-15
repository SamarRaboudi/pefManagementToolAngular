import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteLimitationComponent } from './delete-limitation.component';
import { LimitationService } from '../../../../core/services/limitation.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Limitation } from '../../../../../app/core/models/limitation.model';

describe('DeletelimitationComponent', () => {
  let component: DeleteLimitationComponent;
  let fixture: ComponentFixture<DeleteLimitationComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteLimitationComponent>>;
  let limitationServiceMock: Partial<LimitationService>;
  let mocklimitation: Limitation;

  beforeEach(async () => {
    mocklimitation = { id: 1, name: 'Test limitation', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    limitationServiceMock = {
      updateLimitation: jest.fn(() => of(mocklimitation)),
      limitationAdded: new EventEmitter<Limitation>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ DeleteLimitationComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LimitationService, useValue: limitationServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mocklimitation },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteLimitationComponent);
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

  it('should delete limitation and close dialog on success', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    const spyEmit = jest.spyOn(component.limitationDeleted, 'emit');
    const spylimitationAdded = jest.spyOn(limitationServiceMock.limitationAdded!, 'emit'); // add the non-null assertion operator

    component.deleteLimitation();

    expect(limitationServiceMock.updateLimitation).toHaveBeenCalledWith(mocklimitation.id, {
      name: 'Test limitation',
      value: undefined,
      isActive: false,
      profils: undefined,
    });
    expect(spylimitationAdded).toHaveBeenCalledWith(mocklimitation);
    expect(spyClose).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should handle delete limitation failure', () => {
    jest.spyOn(limitationServiceMock, 'updateLimitation').mockReturnValueOnce(throwError(() => new Error('Failed to update limitation')));
    const spyEmit = jest.spyOn(component.limitationDeleted, 'emit');

    component.deleteLimitation();

    expect(spyEmit).toHaveBeenCalledWith(false);
  });

  it('should log error and not proceed if limitation is invalid', () => {
    console.error = jest.fn();
    component.limitation = { id: undefined, name: '', isActive: true };
    const spyEmit = jest.spyOn(component.limitationDeleted, 'emit');

    component.deleteLimitation();

    expect(console.error).toHaveBeenCalledWith('Cannot deactivate limitation: Invalid limitation or ID is missing.');
    expect(spyEmit).not.toHaveBeenCalled();
  });
});
