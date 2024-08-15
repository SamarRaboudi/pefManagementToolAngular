import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-validation',
  templateUrl: './interview-validation.component.html',
  styleUrls: ['./interview-validation.component.scss']
})
export class InterviewValidationComponent {

  constructor(
    private router: Router ,
    public dialogRef: MatDialogRef<InterviewValidationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onContinue(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/dashboard/admin/interviews']); 
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
