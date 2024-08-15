import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../../../core/services/project.service';
import { ProjectComponent } from './project.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Define a mock projectService
class MockprojectService {
  getProjects = jest.fn(() => of([])); 
  projectAdded = new EventEmitter<any>();
}

describe('projectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let projectServiceMock: MockprojectService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    projectServiceMock = new MockprojectService(); 

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ProjectComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule], 
      providers: [
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getprojects on initialization', () => {
    expect(projectServiceMock.getProjects).toHaveBeenCalled();
  });

  it('should handle projectAdded event', () => {
    const newproject = { id: 1, title: 'Test project',context: 'Test project', isActive: true };
    projectServiceMock.projectAdded.emit(newproject);
    expect(projectServiceMock.getProjects).toHaveBeenCalled();
  });

 
});
