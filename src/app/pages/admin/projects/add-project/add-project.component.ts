import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';
import { Technology } from '../../../../../app/core/models/technology.model';
import { TechnologyService } from '../../../../../app/core/services/technology.service'; 
import { User } from '../../../../../app/core/models/user.model';
import { UserFilters, UserService } from '../../../../../app/core/services/user.service'; 

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit{

  projectForm: FormGroup;
  technologies: Technology[] = [];
  showMissionInput: boolean = false;
  newMission: string = '';
  missions: string[];
  requirements: string[];
  hoveredMission: string | null = null;
  supervisors: User[] = [];
  @Output() projectAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    private projectService: ProjectService,
    private technologyService: TechnologyService,
    private userService: UserService 
  ) { }

  ngOnInit() {
    this.projectForm = new FormGroup({
      title: new FormControl('', Validators.required),
      context: new FormControl('', Validators.required),
      githubRepostoryLink: new FormControl(''),
      mission: new FormControl(''),
      requirement: new FormControl(''),
      technologies: new FormControl([], Validators.required),
      supervisors: new FormControl([], Validators.required),
      github_repostory_link: new FormControl('')
    });

    this.getTechnologies();
    this.getSupervisors();
    this.missions = [];
    this.requirements = [];

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

  addProject(): void {
    if (this.projectForm.valid) {
      const projectData: Project = {
        title: this.projectForm.value.title,
        context: this.projectForm.value.context,
        missions: this.missions,
        requirements: this.requirements,
        technologies: this.projectForm.value.technologies,
        supervisor: this.projectForm.value.supervisors,
        githubRepostoryLink: this.projectForm.value.github_repostory_link,
      };

      this.projectService.addProject(projectData).subscribe(
        (newProject: Project) => {
          this.projectService.projectAdded.emit(newProject);
          this.projectAdded.emit(true); 
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add collaborator:', error);
          this.projectAdded.emit(false); 
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