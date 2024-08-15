import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../../app/core/models/project.model';
import { Technology } from 'src/app/core/models/technology.model';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})
export class DeleteProjectComponent {

  project: Project;
  @Output() projectDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteProjectComponent>,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.project = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteProject(): void {
    if (!this.project || !this.project.id) {
      console.error('Cannot delete project: Invalid user or ID is missing.');
      return;
    }

    let payload: any = {
      title: this.project.title,
      context: this.project.context,
      missions: this.project.missions || [],
      requirements: this.project.requirements || [],
      githubRepostoryLink: this.project.githubRepostoryLink,
      isActive: false
    };

    if (Array.isArray(this.project.technologies) && this.project.technologies.length > 0) { 
      payload.technologies = this.project.technologies.map(Technology => Technology.id);
    }

    this.projectService.updateProject(this.project.id, payload).subscribe(
      (updatedProject: Project) => {
        this.projectService.projectAdded.emit(updatedProject);
        this.projectDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to delete project:', error);
        this.projectDeleted.emit(false);
      }
    );
  }
}

