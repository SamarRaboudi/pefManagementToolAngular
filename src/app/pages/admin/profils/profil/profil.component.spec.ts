import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ProfilService } from '../../../../core/services/profil.service';
import { ProfilComponent } from './profil.component';
import { of } from 'rxjs';

// Define a mock profilService
class MockprofilService {
  getProfils = jest.fn(() => of([])); 
  profilAdded = new EventEmitter<any>();
}

describe('profilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let profilServiceMock: MockprofilService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    profilServiceMock = new MockprofilService(); 

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ProfilComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ProfilService, useValue: profilServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProfils on initialization', () => {
    expect(profilServiceMock.getProfils).toHaveBeenCalled();
  });

  it('should handle profilAdded event', () => {
    const newprofil = { id: 1, titre: 'Test profil', isActive: true };
    profilServiceMock.profilAdded.emit(newprofil);
    expect(profilServiceMock.getProfils).toHaveBeenCalled();
  });

 
});
