import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Technology } from '../../../../../app/core/models/technology.model';
import { TechnologyService } from '../../../../core/services/technology.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-technology',
  templateUrl: './edit-technology.component.html',
  styleUrls: ['./edit-technology.component.scss'],
  providers: [MessageService]
})
export class EditTechnologyComponent implements OnInit{
  technologyForm: FormGroup;
  photoLink: any; 
  technology: Technology;
  techologyId:number;
  logo:any;
  @Output() technologyEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<EditTechnologyComponent>,  
              private technologyService: TechnologyService,
              @Inject(MAT_DIALOG_DATA) public data: Technology 
              ) {
                this.technology = { ...data }; 
                this.photoLink = this.technology.logo;
              }

  ngOnInit() {
    this.technologyForm = new FormGroup({
      label: new FormControl(this.technology.label, [Validators.required]) ,
      logo: new FormControl(null) ,
    });
  }
  getLabelErrorMessage(labelControl: any): string {
    if (labelControl?.hasError('required')) {
      return 'Technology\'s label is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onFileChanged(event: any) {
    const file = event.target.files[0];
    this.technologyForm.patchValue({
      logo: file
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.photoLink = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editTechnology(): void {
    if (!this.technology || !this.technology.id) {
      console.error('Cannot edit technology: Invalid technology or ID is missing.');
      return;
    }
    
    if (this.technologyForm.valid) {
      const labelControl = this.technologyForm.get('label');
      if (labelControl) {
        const technology: Technology = {
          label: labelControl.value,
          isActive: true
        };
        this.techologyId = this.technology.id;
  
        // Check if a new file is selected
        if (this.technologyForm.get('logo')?.value instanceof File) {
          const file = this.technologyForm.get('logo')?.value;
          this.technologyService.uploadTechnologyLogo(this.techologyId, file).subscribe(
            (logoUrl: string) => {
              technology.logo = logoUrl; 
              this.updateTechnologyWithLogo(technology);
            },
            (error) => {
              console.error('Failed to upload logo:', error);
              
            }
          );
        } else {
          // If no new file is selected, update technology without changing the logo
          this.updateTechnologyWithLogo(technology);
        }
      }
    }
  }
  
  private updateTechnologyWithLogo(technology: Technology): void {
    this.technologyService.updateTechnology(this.techologyId, technology).subscribe(
      (updatedTechnology: Technology) => {
        this.technologyService.technologyAdded.emit(updatedTechnology);
        this.technologyEdited.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update technology:', error);
        this.technologyEdited.emit(false);
      }
    );
  }
  
  

}
