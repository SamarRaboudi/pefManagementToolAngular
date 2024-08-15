import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LimitationService, LimitationFilters } from './limitation.service';
import { Limitation } from '../models/limitation.model';
import { of } from 'rxjs';

describe('LimitationService', () => {
  let service: LimitationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LimitationService]
    });

    service = TestBed.inject(LimitationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch limitations', () => {
    const dummyLimitations: Limitation[] = [{ id: 1, name: 'example1' }, { id: 2, name: 'example2' }];

    const page = 1;
    const limit = 10;
    const filters: LimitationFilters = { name: 'testexample', isActive: true };

    service.getLimitations(page, limit, filters).subscribe((limitations: Limitation[]) => {
      expect(limitations.length).toBe(2);
      expect(limitations).toEqual(dummyLimitations);
    });

    const req = httpTestingController.expectOne(req => {
      return req.url === 'limitation' && req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('name') === 'testexample' &&
        req.params.get('isActive') === 'true';
    });
    expect(req.request.method).toBe('GET');

    req.flush(dummyLimitations);
  });

  it('should add a limitation', () => {
    const newLimitation: Limitation = { id: 3, name: 'newexample' };

    service.addLimitation(newLimitation).subscribe((limitation: Limitation) => {
      expect(limitation).toEqual(newLimitation);
    });

    const req = httpTestingController.expectOne('limitation');
    expect(req.request.method).toBe('POST');
    req.flush(newLimitation);
  });

  it('should update a limitation', () => {
    const updatedLimitation: Limitation = { id: 2, name: 'updatedexample' };

    service.updateLimitation(2, updatedLimitation).subscribe((limitation: Limitation) => {
      expect(limitation).toEqual(updatedLimitation);
    });

    const req = httpTestingController.expectOne('limitation/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedLimitation);
  });

});

