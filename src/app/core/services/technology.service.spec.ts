import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TechnologyService, TechnologyFilters } from './technology.service';
import { Technology } from '../models/technology.model';

describe('TechnologyService', () => {
  let service: TechnologyService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TechnologyService]
    });

    service = TestBed.inject(TechnologyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch technologies', () => {
    const dummyTechnologies: Technology[] = [{ id: 1, label: 'Technology 1' }, { id: 2, label: 'Technology 2' }];

    const page = 1;
    const limit = 10;
    const filters: TechnologyFilters = { label: 'test', isActive: true };

    service.getTechnologies(page, limit, filters).subscribe((technologies: Technology[]) => {
      expect(technologies.length).toBe(2);
      expect(technologies).toEqual(dummyTechnologies);
    });

    const req = httpTestingController.expectOne('technology?page=1&limit=10&label=test&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummyTechnologies);
  });

  it('should add a technology', () => {
    const formData = new FormData();
    formData.append('label', 'New Technology');

    service.addTechnology(formData).subscribe((technology: Technology) => {
      expect(technology.label).toEqual('New Technology');
    });

    const req = httpTestingController.expectOne('technology');
    expect(req.request.method).toBe('POST');
    req.flush({ label: 'New Technology' });
  });

  it('should update a technology', () => {
    const updatedTechnology: Technology = { id: 2, label: 'Updated Technology' };

    service.updateTechnology(2, updatedTechnology).subscribe((technology: Technology) => {
      expect(technology).toEqual(updatedTechnology);
    });

    const req = httpTestingController.expectOne('technology/2');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedTechnology);
  });
});
