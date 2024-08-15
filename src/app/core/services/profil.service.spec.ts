import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfilService, ProfilFilters } from './profil.service';
import { Profil } from '../models/profil.model';

describe('ProfilService', () => {
  let service: ProfilService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfilService]
    });

    service = TestBed.inject(ProfilService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch profils', () => {
    const dummyProfils: Profil[] = [{ id: 1, titre: 'Profil 1' }, { id: 2, titre: 'Profil 2' }];

    const page = 1;
    const limit = 10;
    const filters: ProfilFilters = { titre: 'test', isActive: true };

    service.getProfils(page, limit, filters).subscribe((profils: Profil[]) => {
      expect(profils.length).toBe(2);
      expect(profils).toEqual(dummyProfils);
    });

    const req = httpTestingController.expectOne('profils/?page=1&limit=10&titre=test&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummyProfils);
  });

  it('should add a profil', () => {
    const newProfil: Profil = { id: 3, titre: 'New Profil' };

    service.addProfil(newProfil).subscribe((profil: Profil) => {
      expect(profil).toEqual(newProfil);
    });

    const req = httpTestingController.expectOne('profils/');
    expect(req.request.method).toBe('POST');
    req.flush(newProfil);
  });

  it('should update a profil', () => {
    const updatedProfil: Profil = { id: 2, titre: 'Updated Profil' };

    service.updateProfil(2, updatedProfil).subscribe((profil: Profil) => {
      expect(profil).toEqual(updatedProfil);
    });

    const req = httpTestingController.expectOne('profils/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedProfil);
  });
});
