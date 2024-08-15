import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService, ProjectFilters } from './project.service';
import { Project } from '../models/project.model';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });

    service = TestBed.inject(ProjectService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch projects', () => {
    const dummyProjects: Project[] = [
      { id: 1, title: 'Project 1', context: 'Context 1' },
      { id: 2, title: 'Project 2', context: 'Context 2' }
    ];

    const page = 1;
    const limit = 10;
    const filters: ProjectFilters = { title: 'test', isActive: true };

    service.getProjects(page, limit, filters).subscribe((projects: Project[]) => {
      expect(projects.length).toBe(2);
      expect(projects).toEqual(dummyProjects);
    });

    const req = httpTestingController.expectOne(req => {
      return (
        req.url === 'project' &&
        req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('title') === 'test' &&
        req.params.get('isActive') === 'true'
      );
    });

    req.flush(dummyProjects);
  });

  it('should add a project', () => {
    const newProject: Project = { id: 3, title: 'New Project', context: 'New Context' };

    service.addProject(newProject).subscribe((project: Project) => {
      expect(project).toEqual(newProject);
    });

    const req = httpTestingController.expectOne('project');
    expect(req.request.method).toBe('POST');
    req.flush(newProject);
  });

  it('should update a project', () => {
    const updatedProject: Project = { id: 2, title: 'Updated Project', context: 'Updated Project' };

    service.updateProject(2, updatedProject).subscribe((project: Project) => {
      expect(project).toEqual(updatedProject);
    });

    const req = httpTestingController.expectOne('project/2');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProject);
  });
});
