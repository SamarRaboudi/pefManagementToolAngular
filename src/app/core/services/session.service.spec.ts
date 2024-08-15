import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService, SessionFilters } from './session.service';
import { Session } from '../models/session.model';

describe('SessionService', () => {
  let service: SessionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });

    service = TestBed.inject(SessionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch sessions', () => {
    const dummySessions: Session[] = [{ id: 1, name: 'Session 1' }, { id: 2, name: 'Session 2' }];

    const page = 1;
    const limit = 10;
    const filters: SessionFilters = { name: 'test', isActive: true };

    service.getSessions(page, limit, filters).subscribe((sessions: Session[]) => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(dummySessions);
    });

    const req = httpTestingController.expectOne('session?page=1&limit=10&name=test&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummySessions);
  });

  it('should add a session', () => {
    const newSession: Session = { id: 3, name: 'New Session' };

    service.addSession(newSession).subscribe((session: Session) => {
      expect(session).toEqual(newSession);
    });

    const req = httpTestingController.expectOne('session');
    expect(req.request.method).toBe('POST');
    req.flush(newSession);
  });

  it('should update a session', () => {
    const updatedSession: Session = { id: 2, name: 'Updated Session' };

    service.updateSession(2, updatedSession).subscribe((session: Session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpTestingController.expectOne('session/2');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSession);
  });

});
