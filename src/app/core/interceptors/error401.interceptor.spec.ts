import { TestBed } from '@angular/core/testing';

import { Error401Interceptor } from './error401.interceptor';

describe('Eoor401Interceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Error401Interceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: Error401Interceptor = TestBed.inject(Error401Interceptor);
    expect(interceptor).toBeTruthy();
  });
});
