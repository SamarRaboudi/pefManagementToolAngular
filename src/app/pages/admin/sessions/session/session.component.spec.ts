import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../../../core/services/session.service';
import { SessionComponent } from './session.component';
import { of } from 'rxjs';

// Define a mock SessionService
class MockSessionService {
  getSessions = jest.fn(() => of([]));
  sessionAdded = new EventEmitter<any>();
}

describe('SessionComponent', () => {
  let component: SessionComponent;
  let fixture: ComponentFixture<SessionComponent>;
  let sessionServiceMock: MockSessionService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    sessionServiceMock = new MockSessionService(); 

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [SessionComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getSessions on initialization', () => {
    expect(sessionServiceMock.getSessions).toHaveBeenCalled();
  });

  it('should handle sessionAdded event', () => {
    const newSession = { id: 1, name: 'Test Session', isActive: true };
    sessionServiceMock.sessionAdded.emit(newSession);
    expect(sessionServiceMock.getSessions).toHaveBeenCalled();
  });

 
});
