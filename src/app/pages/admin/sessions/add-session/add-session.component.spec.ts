import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AddSessionComponent } from './add-session.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../../../core/services/session.service';
import { of } from 'rxjs';
import { Session } from '../../../../../app/core/models/session.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddSessionComponent', () => {
  let component: AddSessionComponent;
  let fixture: ComponentFixture<AddSessionComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddSessionComponent>>;
  let sessionServiceMock: Partial<SessionService>;
  let mockSession: Session;

  beforeEach(() => {
    mockSession = { id: 1, name: 'Test Session' }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    sessionServiceMock = {
      addSession: jest.fn(() => of(mockSession)), 
      sessionAdded: new EventEmitter<Session>(), 
    };

    TestBed.configureTestingModule({
      declarations: [AddSessionComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: SessionService, useValue: sessionServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize session form with empty name', () => {
    expect(component.sessionForm).toBeInstanceOf(FormGroup);
    expect(component.sessionForm.controls['name'].value).toEqual('');
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should add session and close dialog when addSession method is called with valid form', fakeAsync(() => {
    component.sessionForm = new FormGroup({
      name: new FormControl('New Session', [Validators.required]),
    });

    const emitSpy = jest.spyOn(component['sessionService'].sessionAdded, 'emit');

    component.addSession(); 

    tick(); 

    expect(sessionServiceMock.addSession).toHaveBeenCalledWith({ name: 'New Session' });

    if (component['sessionService'].sessionAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }

    expect(matDialogRefMock.close).toHaveBeenCalled();
}));

});
