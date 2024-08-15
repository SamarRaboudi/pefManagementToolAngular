import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Criteria } from '../../../../../app/core/models/criteria.model';

@Component({
  selector: 'app-delete-criteria',
  templateUrl: './delete-criteria.component.html',
  styleUrls: ['./delete-criteria.component.scss']
})
export class DeleteCriteriaComponent {
  criteria: Criteria;
  @Output() criteriaDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
    public dialogRef: MatDialogRef<DeleteCriteriaComponent>,
    private criteriaService: CriteriaService,
    @Inject(MAT_DIALOG_DATA) public data: Criteria
  ) {
    this.criteria = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteCriteria(): void {
    if (!this.criteria || !this.criteria.id) {
      console.error('Cannot deactivate criteria: Invalid criteria or ID is missing.');
      return;
    }

    let payload: any = {
      name: this.criteria.name,
      value: this.criteria.value,
      isActive: false
    };

    if (Array.isArray(this.criteria.profils) && this.criteria.profils.length > 0) { 
      payload.profils = this.criteria.profils.map(profil => profil.id);
    }

    this.criteriaService.updateCriteria(this.criteria.id, payload).subscribe(
      (updatedCriteria: Criteria) => {
        this.criteriaService.criteriaAdded.emit(updatedCriteria);
        this.criteriaDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update criteria:', error);
        this.criteriaDeleted.emit(false);
      }
    );
  }
}
