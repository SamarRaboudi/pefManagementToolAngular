import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TechnologyService } from '../../../../core/services/technology.service';
import { Technology } from '../../../../../app/core/models/technology.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-delete-technology',
  templateUrl: './delete-technology.component.html',
  styleUrls: ['./delete-technology.component.scss'],
  providers: [MessageService]
})
export class DeleteTechnologyComponent {
  technology: Technology;
  techologyId: number;
  @Output() technologyDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<DeleteTechnologyComponent>,  
    private technologyService: TechnologyService,
    @Inject(MAT_DIALOG_DATA) public data: Technology 
    ) {
      this.technology = { ...data }; 
    }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteTechnology(): void {
    if (!this.technology || !this.technology.id) {
      console.error('Cannot delete technology: Invalid technology or ID is missing.');
      return;
    }
        const technology: Technology = {
          label: this.technology.label,
          isActive: false
        };
        this.techologyId = this.technology.id;
        this.technologyService.updateTechnology(this.techologyId, technology).subscribe(
          (updatedTechnology: Technology) => {
            this.technologyService.technologyAdded.emit(updatedTechnology);
            this.technologyDeleted.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to update technology:', error);
            this.technologyDeleted.emit(false);
          }
        );
      
        }
}
