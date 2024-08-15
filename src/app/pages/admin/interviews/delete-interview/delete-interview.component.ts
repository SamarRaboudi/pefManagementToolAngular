import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InterviewService } from '../../../../core/services/interview.service';
import { Interview } from '../../../../../app/core/models/interview.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-delete-interview',
  templateUrl: './delete-interview.component.html',
  styleUrls: ['./delete-interview.component.scss']
})
export class DeleteInterviewComponent {
  interview: Interview;
  @Output() interviewDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteInterviewComponent>,
    private interviewService: InterviewService,
    @Inject(MAT_DIALOG_DATA) public data: Interview
  ) {
    this.interview = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteInterview(): void {
    if (!this.interview || !this.interview.id) {
      console.error('Cannot deactivate interview: Invalid interview or ID is missing.');
      return;
    }
  
    // delete this if you want the related interviewline to be deleted (1/2)
    const existingUsers = this.interview.interviewLines?.map((line: any) => line.user.id);
  

    let payload: any = {
      interviewDay: this.interview.interviewDay,
      interviewTime: this.interview.interviewTime ? formatDate(this.interview.interviewTime, 'HH:mm:ss', 'en-US') : null,
      isActive: false,
      users: existingUsers  // delete this if you want the related interviewline to be deleted (2/2)
    };
  
    if (typeof this.interview.candidate === 'object' && this.interview.candidate !== null) {
      payload.candidate = this.interview.candidate.id;
    }
  
    this.interviewService.updateInterview(this.interview.id, payload).subscribe(
      (updatedInterview: Interview) => {
        this.interviewService.interviewAdded.emit(updatedInterview);
        this.interviewDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update interview:', error);
        this.interviewDeleted.emit(false);
      }
    );
  }
  
  
}
