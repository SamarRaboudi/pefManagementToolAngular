import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { DeleteProjectComponent } from './delete-project.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectService } from '../../../../core/services/project.service';
import { of } from 'rxjs';
import { Project } from '../../../../../app/core/models/project.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('DeleteProjectComponent', () => {
  let component: DeleteProjectComponent;
  let fixture: ComponentFixture<DeleteProjectComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteProjectComponent>>;
  let projectServiceMock: Partial<ProjectService>;
  let mockproject: Project;

  beforeEach(() => {
    mockproject = { id: 1, title: 'Test project',context: 'Test project',  isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    projectServiceMock = {
      updateProject: jest.fn(() => of(mockproject)),
      projectAdded: new EventEmitter<Project>(),
    };

    TestBed.configureTestingModule({
      declarations: [DeleteProjectComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockproject },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should emit projectAdded event when deleteproject method is called', fakeAsync(() => {
    const emitSpy = jest.spyOn(component['projectService'].projectAdded, 'emit'); 
    
    component.deleteProject();
    
    tick();
    
    expect(projectServiceMock.updateProject).toHaveBeenCalledWith(mockproject.id, {
      title: 'Test project',
      context: 'Test project',
      missions: [],
      requirements: [],
      githubRepostoryLink: undefined, 
      isActive: false,
    });
    
    if (component['projectService'].projectAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
    
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));
  
  
});
