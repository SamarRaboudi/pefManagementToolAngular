import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CandidateService } from '../../../../core/services/candidate.service';
import { Candidate } from '../../../../../app/core/models/candidate.model';

@Component({
  selector: 'app-delete-candidate',
  templateUrl: './delete-candidate.component.html',
  styleUrls: ['./delete-candidate.component.scss']
})
export class DeleteCandidateComponent {

  candidate: Candidate;
  candidateId: number;
  @Output() candidateDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<DeleteCandidateComponent>,  
    private candidateService: CandidateService,
    @Inject(MAT_DIALOG_DATA) public data: Candidate 
    ) {
      this.candidate = { ...data }; 
    }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteCandidate(): void {
    if (!this.candidate || !this.candidate.id) {
      console.error('Cannot delete candidate: Invalid candidate or ID is missing.');
      return;
    }
        const candidate: Candidate = {
          firstName: this.candidate.firstName,
          lastName: this.candidate.lastName,
          email: this.candidate.email,
          isActive: false
        };
        this.candidateId = this.candidate.id;
        this.candidateService.updateCandidate(this.candidateId, candidate).subscribe(
          (updatedCandidate: Candidate) => {
            this.candidateService.candidateAdded.emit(updatedCandidate);
            this.candidateDeleted.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to delete candidate:', error);
            this.candidateDeleted.emit(false);
          }
        );
      
        }
}

