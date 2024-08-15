import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { EditSessionComponent } from './edit-session.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../../../core/services/session.service';
import { of } from 'rxjs';
import { Session } from '../../../../../app/core/models/session.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('EditSessionComponent', () => {
  let component: EditSessionComponent;
  let fixture: ComponentFixture<EditSessionComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditSessionComponent>>;
  let sessionServiceMock: Partial<SessionService>;
  let mockSession: Session;

  beforeEach(() => {
    mockSession = { id: 1, name: 'Test Session', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    sessionServiceMock = {
      updateSession: jest.fn(() => of(mockSession)),
      sessionAdded: new EventEmitter<Session>(),
    };

    TestBed.configureTestingModule({
      declarations: [EditSessionComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockSession },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize session form with session name', () => {
    expect(component.sessionForm).toBeInstanceOf(FormGroup);
    expect(component.sessionForm.controls['name'].value).toEqual(mockSession.name);
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should emit sessionAdded event when editSession method is called', fakeAsync(() => {
    component.sessionForm = new FormGroup({
      name: new FormControl('Updated Session Name', [Validators.required]),
    });
  
    const emitSpy = jest.spyOn(component['sessionService'].sessionAdded, 'emit'); 
  
    component.editSession();
  
    tick();
  
    expect(sessionServiceMock.updateSession).toHaveBeenCalledWith(mockSession.id, {
      name: 'Updated Session Name',
      isActive: true,
    });
  
    if (component['sessionService'].sessionAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
