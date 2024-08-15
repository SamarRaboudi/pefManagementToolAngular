import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-interview-confirmation',
  templateUrl: './interview-confirmation.component.html',
  styleUrls: ['./interview-confirmation.component.scss']
})
export class InterviewConfirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<InterviewConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
