import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { EditProjectComponent } from './edit-project.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectService } from '../../../../core/services/project.service';
import { of } from 'rxjs';
import { Project } from '../../../../../app/core/models/project.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditProjectComponent', () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditProjectComponent>>;
  let projectServiceMock: Partial<ProjectService>;
  let mockProject: Project;

  beforeEach(() => {
    mockProject = { id: 1, title: 'Test project', context: 'Test project', isActive: true }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    projectServiceMock = {
      updateProject: jest.fn(() => of(mockProject)), 
      projectAdded: new EventEmitter<Project>(), 
    };

    TestBed.configureTestingModule({
      declarations: [EditProjectComponent],
      imports: [HttpClientTestingModule], 
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: ProjectService, useValue: projectServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockProject } // Provide mock data
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize project form with empty title', () => {
    expect(component.projectForm).toBeInstanceOf(FormGroup);
    expect(component.projectForm.controls['title'].value).toEqual('Test project');
  });

  it('should initialize project form with empty context', () => {
    expect(component.projectForm).toBeInstanceOf(FormGroup);
    expect(component.projectForm.controls['context'].value).toEqual('Test project');
  });


  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should update project and close dialog when editProject method is called with valid form', fakeAsync(() => {
    component.projectForm = new FormGroup({
      title: new FormControl('New project', [Validators.required]),
      context: new FormControl('New context', [Validators.required]),
      missions: new FormControl([]), 
      requirements: new FormControl([]), 
      technologies: new FormControl([]), 
      supervisors: new FormControl([]), 
      github_repostory_link: new FormControl(''), 
    });
  
    const emitSpy = jest.spyOn(component['projectService'].projectAdded, 'emit');
  
    component.editProject(); 
  
    tick(); 
  
    expect(projectServiceMock.updateProject).toHaveBeenCalledWith(1, {
      title: 'New project',
      context: 'New context',
      missions: [], 
      requirements: [], 
      technologies: [], 
      supervisor: [], 
      isActive: true, // Ensure isActive is set correctly
      githubRepostoryLink: '', 
    });
  
    if (component['projectService'].projectAdded) { 
      expect(emitSpy).toHaveBeenCalled();
    }
  
    expect(matDialogRefMock.close).toHaveBeenCalled();
  }));

  it('should add mission to missions array when addMission method is called', () => {
    const initialMissionCount = component.missions.length;
    const newMission = 'Test Mission';
    
    component.projectForm.get('mission')?.setValue(newMission);
    component.addMission();
  
    expect(component.missions.length).toBe(initialMissionCount + 1);
    expect(component.missions[initialMissionCount]).toBe(newMission);
  });
  
  it('should delete mission from missions array when deleteMission method is called', () => {
    const missionToDelete = 'Test Mission';
    component.missions = ['Mission 1', 'Mission 2', missionToDelete, 'Mission 3'];
  
    const initialMissionCount = component.missions.length;
  
    component.deleteMission(missionToDelete);
  
    expect(component.missions.length).toBe(initialMissionCount - 1);
    expect(component.missions.includes(missionToDelete)).toBe(false);
  });
  
  it('should add requirement to requirements array when addRequirement method is called', () => {
    const initialRequirementCount = component.requirements.length;
    const newRequirement = 'Test Requirement';
    
    component.projectForm.get('requirement')?.setValue(newRequirement);
    component.addRequirement();
  
    expect(component.requirements.length).toBe(initialRequirementCount + 1);
    expect(component.requirements[initialRequirementCount]).toBe(newRequirement);
  });
  
  it('should delete requirement from requirements array when deleteRequirement method is called', () => {
    const requirementToDelete = 'Test Requirement';
    component.requirements = ['Requirement 1', 'Requirement 2', requirementToDelete, 'Requirement 3'];
  
    const initialRequirementCount = component.requirements.length;
  
    component.deleteRequirement(requirementToDelete);
  
    expect(component.requirements.length).toBe(initialRequirementCount - 1);
    expect(component.requirements.includes(requirementToDelete)).toBe(false);
  });
  
});
