import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-evaluation-cofirmation',
  templateUrl: './evaluation-cofirmation.component.html',
  styleUrls: ['./evaluation-cofirmation.component.scss']
})
export class EvaluationCofirmationComponent {

  constructor(
    public dialogRef: MatDialogRef<EvaluationCofirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
