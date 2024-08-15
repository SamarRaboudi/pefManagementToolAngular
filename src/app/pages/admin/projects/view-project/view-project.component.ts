import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '../../../../core/models/project.model';


@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit{
  missions: any;
  requirements: any;
  project: Project;
  projectId:number;

  constructor(
    public dialogRef: MatDialogRef<ViewProjectComponent>,

    @Inject(MAT_DIALOG_DATA) public data: Project 
    ) {
      this.project = { ...data }; 
    }

  

  ngOnInit() {
  

    this.missions = this.project.missions || [];
    this.requirements = this.project.requirements || [];

  }


  closeDialog(): void {
    this.dialogRef.close();
  }

 


  


}

