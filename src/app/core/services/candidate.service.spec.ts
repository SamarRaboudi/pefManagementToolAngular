import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CandidateService, CandidateFilters } from './candidate.service';
import { Candidate } from '../models/candidate.model';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidateService]
    });

    service = TestBed.inject(CandidateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch candidates', () => {
    const dummyCandidates: Candidate[] = [{ id: 1, firstName: 'John', lastName: 'Doe' }, { id: 2, firstName: 'Jane', lastName: 'Doe' }];

    const page = 1;
    const limit = 10;
    const filters: CandidateFilters = { firstName: 'John', isActive: true };

    service.getCandidates(page, limit, filters).subscribe((candidates: Candidate[]) => {
      expect(candidates.length).toBe(2);
      expect(candidates).toEqual(dummyCandidates);
    });

    const req = httpTestingController.expectOne('candidate?page=1&limit=10&firstName=John&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummyCandidates);
  });

  it('should add a candidate', () => {
    const formData = new FormData();
    formData.append('firstName', 'John');
    formData.append('lastName', 'Doe');

    service.addCandidate(formData).subscribe((candidate: Candidate) => {
      expect(candidate.firstName).toEqual('John');
      expect(candidate.lastName).toEqual('Doe');
    });

    const req = httpTestingController.expectOne('candidate');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 3, firstName: 'John', lastName: 'Doe' });
  });

  it('should update a candidate', () => {
    const updatedCandidate: Candidate = { id: 2, firstName: 'Jane', lastName: 'Smith' };

    service.updateCandidate(2, updatedCandidate).subscribe((candidate: Candidate) => {
      expect(candidate).toEqual(updatedCandidate);
    });

    const req = httpTestingController.expectOne('candidate/2');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedCandidate);
  });
});
