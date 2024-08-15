import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { User } from '../../../../../app/core/models/user.model';

@Component({
  selector: 'app-availability-dialog',
  templateUrl: './availability-dialog.component.html',
  styleUrls: ['./availability-dialog.component.scss']
})
export class AvailabilityDialogComponent implements OnInit {
  availabilityForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AvailabilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { evaluator: User, day: string, timeRanges: Array<{ startTime: string, endTime: string }> },
    private fb: FormBuilder
  ) {
    this.availabilityForm = this.fb.group({
      timeRanges: this.fb.array([])
    });
  }

  ngOnInit(): void {
    console.log('Injected day:', this.data.day); 
    if (this.data.timeRanges.length > 0) {
      this.data.timeRanges.forEach(timeRange => {
        this.addTimeRange(timeRange.startTime, timeRange.endTime);
      });
    } else {
      this.addTimeRange(); 
    }
  }

  get timeRanges(): FormArray {
    return this.availabilityForm.get('timeRanges') as FormArray;
  }

  addTimeRange(startTime: string = '', endTime: string = ''): void {
    const timeRangeForm = this.fb.group({
      startTime: [startTime, Validators.required],
      endTime: [endTime, Validators.required]
    });
    this.timeRanges.push(timeRangeForm);
  }

  removeTimeRange(index: number): void {
    this.timeRanges.removeAt(index);
  }

  save(): void {
    if (this.availabilityForm.valid) {
      console.log(this.availabilityForm.value);
      this.dialogRef.close(this.availabilityForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
