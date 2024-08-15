import { TestBed } from '@angular/core/testing';

import { EvaluationDataService } from './evaluation-data.service';

describe('EvaluationDataService', () => {
  let service: EvaluationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
