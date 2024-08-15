import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamService, TeamFilters } from './team.service';
import { Team } from '../models/team.model';
import { of } from 'rxjs';

describe('TeamService', () => {
  let service: TeamService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamService]
    });

    service = TestBed.inject(TeamService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch teams', () => {
    const dummyTeams: Team[] = [{ id: 1, name: 'example1' }, { id: 2, name: 'example2' }];

    const page = 1;
    const limit = 10;
    const filters: TeamFilters = { name: 'testexample', isActive: true };

    service.getTeams(page, limit, filters).subscribe((teams: Team[]) => {
      expect(teams.length).toBe(2);
      expect(teams).toEqual(dummyTeams);
    });

    const req = httpTestingController.expectOne(req => {
      return req.url === 'teams' && req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('name') === 'testexample' &&
        req.params.get('isActive') === 'true';
    });
    expect(req.request.method).toBe('GET');

    req.flush(dummyTeams);
  });

  it('should add a team', () => {
    const newTeam: Team = { id: 3, name: 'newexample' };

    service.addTeam(newTeam).subscribe((team: Team) => {
      expect(team).toEqual(newTeam);
    });

    const req = httpTestingController.expectOne('teams');
    expect(req.request.method).toBe('POST');
    req.flush(newTeam);
  });

  it('should update a team', () => {
    const updatedTeam: Team = { id: 2, name: 'updatedexample' };

    service.updateTeam(2, updatedTeam).subscribe((team: Team) => {
      expect(team).toEqual(updatedTeam);
    });

    const req = httpTestingController.expectOne('teams/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedTeam);
  });

});
