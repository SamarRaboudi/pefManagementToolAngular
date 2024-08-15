import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CriteriaService, CriteriaFilters } from './criteria.service';
import { Criteria } from '../models/criteria.model';

describe('CriteriaService', () => {
  let service: CriteriaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CriteriaService]
    });

    service = TestBed.inject(CriteriaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch criterias', () => {
    const dummyCriterias: Criteria[] = [
      { id: 1, name: 'Criteria 1' },
      { id: 2, name: 'Criteria 2' }
    ];

    const page = 1;
    const limit = 10;
    const filters: CriteriaFilters = { name: 'test', isActive: true };

    service.getCriterias(page, limit, filters).subscribe((criterias: Criteria[]) => {
      expect(criterias.length).toBe(2);
      expect(criterias).toEqual(dummyCriterias);
    });

    const req = httpTestingController.expectOne(req => {
      return (
        req.url === 'criterias' &&
        req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('name') === 'test' &&
        req.params.get('isActive') === 'true'
      );
    });

    req.flush(dummyCriterias);
  });

  it('should add a criteria', () => {
    const newCriteria: Criteria = { id: 3, name: 'New Criteria' };

    service.addCriteria(newCriteria).subscribe((criteria: Criteria) => {
      expect(criteria).toEqual(newCriteria);
    });

    const req = httpTestingController.expectOne('criterias');
    expect(req.request.method).toBe('POST');
    req.flush(newCriteria);
  });

  it('should update a criteria', () => {
    const updatedCriteria: Criteria = { id: 2, name: 'Updated Criteria' };

    service.updateCriteria(2, updatedCriteria).subscribe((criteria: Criteria) => {
      expect(criteria).toEqual(updatedCriteria);
    });

    const req = httpTestingController.expectOne('criterias/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedCriteria);
  });

});
