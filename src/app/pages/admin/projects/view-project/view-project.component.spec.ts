import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewProjectComponent } from './view-project.component';
import { Project } from 'src/app/core/models/project.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewProjectComponent', () => {
  let component: ViewProjectComponent;
  let fixture: ComponentFixture<ViewProjectComponent>;
  const mockProject: Project = { id: 1, title: 'Test project', context: 'Test project', isActive: true };
  let matDialogRefMock: Partial<MatDialogRef<ViewProjectComponent>>;

  beforeEach(async () => {

    matDialogRefMock = {
      close: jest.fn(), 
    };
  
    await TestBed.configureTestingModule({
      declarations: [ViewProjectComponent],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock }, 
        { provide: MAT_DIALOG_DATA, useValue: mockProject }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ViewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize missions and requirements arrays with project data', () => {
    expect(component.project).toEqual(mockProject);
    expect(component.missions).toEqual(mockProject.missions || []);
    expect(component.requirements).toEqual(mockProject.requirements || []);
  });

  
  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

});
