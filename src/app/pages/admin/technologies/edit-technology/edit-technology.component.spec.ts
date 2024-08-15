import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { EditTechnologyComponent } from './edit-technology.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TechnologyService } from '../../../../core/services/technology.service';
import { of } from 'rxjs';
import { Technology } from '../../../../../app/core/models/technology.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EdittechnologyComponent', () => {
  let component: EditTechnologyComponent;
  let fixture: ComponentFixture<EditTechnologyComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditTechnologyComponent>>;
  let technologyServiceMock: Partial<TechnologyService>;
  let mocktechnology: Technology;

  beforeEach(() => {
    mocktechnology = { id: 1, label: 'Test technology', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    technologyServiceMock = {
      updateTechnology: jest.fn(() => of(mocktechnology)),
      technologyAdded: new EventEmitter<Technology>(),
    };

    TestBed.configureTestingModule({
      declarations: [EditTechnologyComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TechnologyService, useValue: technologyServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mocktechnology },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTechnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize technology form with technology label', () => {
    expect(component.technologyForm).toBeInstanceOf(FormGroup);
    expect(component.technologyForm.controls['label'].value).toEqual(mocktechnology.label);
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should emit technologyAdded event when edittechnology method is called', fakeAsync(() => {
    component.technologyForm = new FormGroup({
      label: new FormControl('Updated technology label', [Validators.required]),
    });
  
    const emitSpy = jest.spyOn(component['technologyService'].technologyAdded, 'emit'); 
  
    component.editTechnology();
  
    tick();
  
    expect(technologyServiceMock.updateTechnology).toHaveBeenCalledWith(mocktechnology.id, {
      label: 'Updated technology label',
      isActive: true,
    });
  
    if (component['technologyService'].technologyAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
