import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriteriaService, CriteriaFilters } from '../../../../core/services/criteria.service';
import { AddCriteriaComponent } from './add-criteria.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Profil } from '../../../../core/models/profil.model';
import { ProfilService } from '../../../../core/services/profil.service';

describe('AddCriteriaComponent', () => {
  let component: AddCriteriaComponent;
  let fixture: ComponentFixture<AddCriteriaComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddCriteriaComponent>>;
  let criteriaServiceMock: Partial<CriteriaService>;
  let profilServiceMock: Partial<ProfilService>;
  let mockCriteria: Criteria;
  let mockProfils: Profil[];

  beforeEach(async () => {
    mockCriteria = { id: 1, name: 'Test criteria', value: 1, profils: [] }; 
    mockProfils = [{ id: 1, titre: 'Profil 1' }, { id: 2, titre: 'Profil 2' }];

    matDialogRefMock = {
      close: jest.fn(), 
    };

    criteriaServiceMock = {
      addCriteria: jest.fn(() => of(mockCriteria)), 
      criteriaAdded: new EventEmitter<Criteria>(), 
    };

    profilServiceMock = {
      getProfils: jest.fn(() => of(mockProfils)),
    };

    await TestBed.configureTestingModule({
      declarations: [ AddCriteriaComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: ProfilService, useValue: profilServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.criteriaForm).toBeDefined();
    expect(component.criteriaForm.get('name')?.value).toBe('');
    expect(component.criteriaForm.get('value')?.value).toBe(1);
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

  it('should add criteria and close dialog on valid form submission', () => {
    const spyClose = jest.spyOn(component.dialogRef, 'close');
    const spyEmit = jest.spyOn(component.criteriaAdded, 'emit');

    component.criteriaForm.setValue({
      name: 'New Criteria',
      value: 5,
      profils: [],
    });

    component.addCriteria();

    expect(criteriaServiceMock.addCriteria).toHaveBeenCalledWith({
      name: 'New Criteria',
      value: 5,
      profils: [],
    });
    expect(spyClose).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should handle criteria addition failure', () => {
    jest.spyOn(criteriaServiceMock, 'addCriteria').mockReturnValueOnce(throwError(() => new Error('Failed to add criteria')));
    const spyEmit = jest.spyOn(component.criteriaAdded, 'emit');

    component.criteriaForm.setValue({
      name: 'New Criteria',
      value: 5,
      profils: [],
    });

    component.addCriteria();

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
