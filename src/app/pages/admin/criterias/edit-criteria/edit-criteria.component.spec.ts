import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { EditCriteriaComponent } from './edit-criteria.component';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';
import { HttpClientModule } from '@angular/common/http';
import { ProfilService } from '../../../../core/services/profil.service';
import { Profil } from '../../../../core/models/profil.model';

describe('EditCriteriaComponent', () => {
  let component: EditCriteriaComponent;
  let fixture: ComponentFixture<EditCriteriaComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditCriteriaComponent>>;
  let criteriaServiceMock: Partial<CriteriaService>;
  let profilServiceMock: Partial<ProfilService>;
  let mockCriteria: Criteria;
  let mockProfils: Profil[];

  beforeEach(async () => {
    mockCriteria = { id: 1, name: 'Test Session', isActive: true, value: 1, profils: [] };
    mockProfils = [{ id: 1, titre: 'Profil 1' }, { id: 2, titre: 'Profil 2' }];

    matDialogRefMock = {
      close: jest.fn(),
    };

    criteriaServiceMock = {
      updateCriteria: jest.fn(() => of(mockCriteria)),
      criteriaAdded: new EventEmitter<Criteria>(),
    };

    profilServiceMock = {
      getProfils: jest.fn(() => of(mockProfils)),
    };

    await TestBed.configureTestingModule({
      declarations: [ EditCriteriaComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: ProfilService, useValue: profilServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockCriteria },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();  // Manually call ngOnInit to ensure the method is triggered
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.criteriaForm).toBeDefined();
    expect(component.criteriaForm.get('name')?.value).toBe(mockCriteria.name);
    expect(component.criteriaForm.get('value')?.value).toBe(mockCriteria.value);
    expect(component.criteriaForm.get('profils')?.value).toEqual([]);
  });

  it('should validate form inputs', () => {
    const nameControl = component.criteriaForm.get('name');
    const valueControl = component.criteriaForm.get('value');

    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(component.getnameErrorMessage(nameControl)).toBe('Name is required.');

    valueControl?.setValue('');
    expect(valueControl?.valid).toBeFalsy();
    expect(component.getvalueErrorMessage(valueControl)).toBe('Value is required.');

    nameControl?.setValue('Valid Name');
    valueControl?.setValue(10);
    expect(nameControl?.valid).toBeTruthy();
    expect(valueControl?.valid).toBeTruthy();
  });

  it('should edit criteria and close dialog on valid form submission', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    const spyEmit = jest.spyOn(component.criteriaEdited, 'emit');

    component.criteriaForm.setValue({
      name: 'Updated Criteria',
      value: 5,
      profils: [],
    });

    component.editCriteria();

    expect(criteriaServiceMock.updateCriteria).toHaveBeenCalledWith(mockCriteria.id, {
      name: 'Updated Criteria',
      value: 5,
      profils: [],
      isActive: true,
    });
    expect(spyClose).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should handle criteria edit failure', () => {
    jest.spyOn(criteriaServiceMock, 'updateCriteria').mockReturnValueOnce(throwError(() => new Error('Failed to update criteria')));
    const spyEmit = jest.spyOn(component.criteriaEdited, 'emit');

    component.criteriaForm.setValue({
      name: 'Updated Criteria',
      value: 5,
      profils: [],
    });

    component.editCriteria();

    expect(spyEmit).toHaveBeenCalledWith(false);
  });

  it('should fetch profils on initialization', () => {
    expect(profilServiceMock.getProfils).toHaveBeenCalled();
    expect(component.profils).toEqual(mockProfils);
  });

  it('should close dialog', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(spyClose).toHaveBeenCalled();
  });
});
