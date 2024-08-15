import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DeleteTechnologyComponent } from './delete-technology.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TechnologyService } from '../../../../core/services/technology.service';
import { of } from 'rxjs';
import { Technology } from '../../../../../app/core/models/technology.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('deletetechnologyComponent', () => {
  let component: DeleteTechnologyComponent;
  let fixture: ComponentFixture<DeleteTechnologyComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteTechnologyComponent>>;
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
      declarations: [DeleteTechnologyComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TechnologyService, useValue: technologyServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mocktechnology },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTechnologyComponent);
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

  it('should emit technologyAdded event when deletetechnology method is called', fakeAsync(() => {
  
    const emitSpy = jest.spyOn(component['technologyService'].technologyAdded, 'emit'); 
  
    component.deleteTechnology();
  
    tick();
  
    expect(technologyServiceMock.updateTechnology).toHaveBeenCalledWith(mocktechnology.id, {
      label: 'Test technology',
      isActive: false,
    });
  
    if (component['technologyService'].technologyAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
