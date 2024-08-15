import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { EditProfilComponent } from './edit-profil.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfilService } from '../../../../core/services/profil.service';
import { of } from 'rxjs';
import { Profil } from '../../../../../app/core/models/profil.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditprofilComponent', () => {
  let component: EditProfilComponent;
  let fixture: ComponentFixture<EditProfilComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditProfilComponent>>;
  let profilServiceMock: Partial<ProfilService>;
  let mockprofil: Profil;

  beforeEach(() => {
    mockprofil = { id: 1, titre: 'Test profil', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    profilServiceMock = {
      updateProfil: jest.fn(() => of(mockprofil)),
      profilAdded: new EventEmitter<Profil>(),
    };

    TestBed.configureTestingModule({
      declarations: [EditProfilComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ProfilService, useValue: profilServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockprofil },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profil form with profil titre', () => {
    expect(component.profilForm).toBeInstanceOf(FormGroup);
    expect(component.profilForm.controls['titre'].value).toEqual(mockprofil.titre);
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should emit profilAdded event when editprofil method is called', fakeAsync(() => {
    component.profilForm = new FormGroup({
      titre: new FormControl('Updated profil titre', [Validators.required]),
    });
  
    const emitSpy = jest.spyOn(component['profilService'].profilAdded, 'emit'); 
  
    component.editProfil();
  
    tick();
  
    expect(profilServiceMock.updateProfil).toHaveBeenCalledWith(mockprofil.id, {
      titre: 'Updated profil titre',
      isActive: true,
    });
  
    if (component['profilService'].profilAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
