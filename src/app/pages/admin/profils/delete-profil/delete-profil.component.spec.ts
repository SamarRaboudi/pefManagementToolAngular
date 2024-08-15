import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DeleteProfilComponent } from './delete-profil.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfilService } from '../../../../core/services/profil.service';
import { of } from 'rxjs';
import { Profil } from '../../../../../app/core/models/profil.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('deleteprofilComponent', () => {
  let component: DeleteProfilComponent;
  let fixture: ComponentFixture<DeleteProfilComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteProfilComponent>>;
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
      declarations: [DeleteProfilComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ProfilService, useValue: profilServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockprofil },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProfilComponent);
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

  it('should emit profilAdded event when deleteprofil method is called', fakeAsync(() => {
  
    const emitSpy = jest.spyOn(component['profilService'].profilAdded, 'emit'); 
  
    component.deleteProfil();
  
    tick();
  
    expect(profilServiceMock.updateProfil).toHaveBeenCalledWith(mockprofil.id, {
      titre: 'Test profil',
      isActive: false,
    });
  
    if (component['profilService'].profilAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
