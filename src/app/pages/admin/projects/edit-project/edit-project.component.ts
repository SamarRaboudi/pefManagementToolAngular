import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../../../app/core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { Technology } from '../../../../../app/core/models/technology.model';
import { TechnologyService } from '../../../../../app/core/services/technology.service'; 
import { UserFilters, UserService } from '../../../../../app/core/services/user.service'; 
import { User } from '../../../../../app/core/models/user.model';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit{
  projectForm: FormGroup;
  technologies: Technology[] = [];
  showMissionInput: boolean = false;
  newMission: string = '';
  missions: any;
  requirements: any;
  hoveredMission: string | null = null;
  project: Project;
  projectId:number;
  supervisors: User[] = [];
  @Output() projectEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditProjectComponent>,
    private projectService: ProjectService,
    private technologyService: TechnologyService,
    private userService: UserService ,
    @Inject(MAT_DIALOG_DATA) public data: Project 
    ) {
      this.project = { ...data }; 
    }

  

  ngOnInit() {
    this.projectForm = new FormGroup({
      title: new FormControl(this.project.title, Validators.required),
      context: new FormControl(this.project.context, Validators.required),
      mission: new FormControl(''),
      requirement: new FormControl(''),
      technologies: new FormControl(this.project.technologies ? this.project.technologies.map(technology => technology.id) : [], Validators.required),
      supervisors: new FormControl(this.project.supervisor ? this.project.supervisor.map(supervisor => supervisor.id) : [], Validators.required),
      github_repostory_link: new FormControl(this.project.githubRepostoryLink)
    });

    this.getTechnologies();
    this.getSupervisors();
    this.missions = this.project.missions || [];
    this.requirements = this.project.requirements || [];

  }

  getTitleErrorMessage(titleControl: any): string {
    if (titleControl?.hasError('required')) {
      return 'Project\'s title is required.';
    }
    return '';
  }

  getContextErrorMessage(contextControl: any): string {
    if (contextControl?.hasError('required')) {
      return 'Project\'s Context is required.';
    }
    return '';
  }

  editProject(): void {
    if (!this.project || !this.project.id) {
      console.error('Cannot edit project: Invalid project or ID is missing.');
      return;
    }

    if (this.projectForm.valid) {
      const updatedProject: Project = {
        title: this.projectForm.get('title')?.value,
        context: this.projectForm.get('context')?.value,
        missions: this.missions,
        technologies: this.projectForm.get('technologies')?.value, 
        supervisor: this.projectForm.get('supervisors')?.value, 
        requirements: this.requirements,
        isActive: this.project.isActive,
        githubRepostoryLink: this.projectForm.get('github_repostory_link')?.value
      };

      this.projectService.updateProject(this.project.id, updatedProject).subscribe(
        (updatedProjectResponse: Project) => {
          this.projectService.projectAdded.emit(updatedProjectResponse);
          this.projectEdited.emit(true);
          this.dialogRef.close(updatedProjectResponse);
        },
        (error: any) => {
          console.error('Failed to update project:', error);
          this.projectEdited.emit(false);
        }
      );
    }
  }
  
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  getTechnologies(): void {
    this.technologyService.getTechnologies(1, 50, {}).subscribe((technologies: Technology[]) => {
      this.technologies = technologies;
    });
  }

  getSupervisors(): void {
    const supervisorFilter: UserFilters = {
      searchQuery: 'Supervisor' 
    };
  
    this.userService.getUsers(1, 50, supervisorFilter).subscribe((supervisors: User[]) => {
      this.supervisors = supervisors;
    });
  }

  addMission(): void {
    const mission = this.projectForm.get('mission')?.value.trim();
    if (mission) {
      this.missions.push(mission);
      this.projectForm.get('mission')?.setValue('');
    }
  }
  
  deleteMission(mission: string): void {
    if (this.missions) {
      const index = this.missions.indexOf(mission);
      if (index !== -1) {
        this.missions.splice(index, 1);
      }
    }
  }
  showDeleteButton(mission: string): void {
    this.hoveredMission = mission;
  }
  
  hideDeleteButton(mission: string): void {
    if (this.hoveredMission === mission) {
      this.hoveredMission = null;
    }
  }
  
  isHovered(mission: string): boolean {
    return this.hoveredMission === mission;
  }

  addRequirement(): void {
    const requirement = this.projectForm.get('requirement')?.value.trim();
    if (requirement) {
      this.requirements.push(requirement);
      this.projectForm.get('requirement')?.setValue('');
    }
  }
  
  deleteRequirement(requirement: string): void {
    if (this.requirements) {
      const index = this.requirements.indexOf(requirement);
      if (index !== -1) {
        this.requirements.splice(index, 1);
      }
    }
  }
  


}
