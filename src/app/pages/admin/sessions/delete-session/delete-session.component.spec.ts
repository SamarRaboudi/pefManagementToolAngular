import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DeleteSessionComponent } from './delete-session.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionService } from '../../../../core/services/session.service';
import { of } from 'rxjs';
import { Session } from '../../../../../app/core/models/session.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('deleteSessionComponent', () => {
  let component: DeleteSessionComponent;
  let fixture: ComponentFixture<DeleteSessionComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteSessionComponent>>;
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
      declarations: [DeleteSessionComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockSession },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSessionComponent);
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

  it('should emit sessionAdded event when deleteSession method is called', fakeAsync(() => {
  
    const emitSpy = jest.spyOn(component['sessionService'].sessionAdded, 'emit'); 
  
    component.deleteSession();
  
    tick();
  
    expect(sessionServiceMock.updateSession).toHaveBeenCalledWith(mockSession.id, {
      name: 'Test Session',
      isActive: false,
    });
  
    if (component['sessionService'].sessionAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
});
