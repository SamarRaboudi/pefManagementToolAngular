import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LimitationService } from '../../../../core/services/limitation.service';
import { Limitation } from '../../../../../app/core/models/limitation.model';

@Component({
  selector: 'app-delete-limitation',
  templateUrl: './delete-limitation.component.html',
  styleUrls: ['./delete-limitation.component.scss']
})
export class DeleteLimitationComponent {
  limitation: Limitation;
  @Output() limitationDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteLimitationComponent>,
    private limitationService: LimitationService,
    @Inject(MAT_DIALOG_DATA) public data: Limitation
  ) {
    this.limitation = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteLimitation(): void {
    if (!this.limitation || !this.limitation.id) {
      console.error('Cannot deactivate limitation: Invalid limitation or ID is missing.');
      return;
    }

    let payload: any = {
      name: this.limitation.name,
      isActive: false
    };

    if (Array.isArray(this.limitation.users) && this.limitation.users.length > 0) { 
      payload.users = this.limitation.users.map(user => user.id);
    }
    if (Array.isArray(this.limitation.candidates) && this.limitation.candidates.length > 0) { 
      payload.candidates = this.limitation.candidates.map(candidate => candidate.id);
    }
    if (typeof this.limitation.session === 'object' && this.limitation.session !== null) {
      payload.session = this.limitation.session.id;
    }

    this.limitationService.updateLimitation(this.limitation.id, payload).subscribe(
      (updatedLimitation: Limitation) => {
        this.limitationService.limitationAdded.emit(updatedLimitation);
        this.limitationDeleted.emit(true); 
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update limitation:', error);
        this.limitationDeleted.emit(false); 
      }
    );
  }
}
