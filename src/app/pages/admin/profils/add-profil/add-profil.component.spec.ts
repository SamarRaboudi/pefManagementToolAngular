import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AddProfilComponent } from './add-profil.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfilService } from '../../../../core/services/profil.service';
import { of } from 'rxjs';
import { Profil } from '../../../../../app/core/models/profil.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddprofilComponent', () => {
  let component: AddProfilComponent;
  let fixture: ComponentFixture<AddProfilComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddProfilComponent>>;
  let profilServiceMock: Partial<ProfilService>;
  let mockprofil: Profil;
  

  beforeEach(() => {
    mockprofil = { id: 1, titre: 'Test profil' }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    profilServiceMock = {
      addProfil: jest.fn(() => of(mockprofil)), 
      profilAdded: new EventEmitter<Profil>(), 
    };

    TestBed.configureTestingModule({
      declarations: [AddProfilComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ProfilService, useValue: profilServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profil form with empty titre', () => {
    expect(component.profilForm).toBeInstanceOf(FormGroup);
    expect(component.profilForm.controls['titre'].value).toEqual('');
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should add profil and close dialog when addprofil method is called with valid form', fakeAsync(() => {
    component.profilForm = new FormGroup({
      titre: new FormControl('New profil', [Validators.required]),
    });

    const emitSpy = jest.spyOn(component['profilService'].profilAdded, 'emit');

    component.addProfil(); 

    tick(); 

    expect(profilServiceMock.addProfil).toHaveBeenCalledWith({ titre: 'New profil' });

    if (component['profilService'].profilAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }

    expect(matDialogRefMock.close).toHaveBeenCalled();
}));

});
