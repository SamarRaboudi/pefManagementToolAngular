import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-validation',
  templateUrl: './evaluation-validation.component.html',
  styleUrls: ['./evaluation-validation.component.scss']
})
export class EvaluationValidationComponent {

  constructor(
    private router: Router ,
    public dialogRef: MatDialogRef<EvaluationValidationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  onContinue(): void {
    this.dialogRef.close(true);
    this.router.navigate(['/dashboard/admin']); 
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
