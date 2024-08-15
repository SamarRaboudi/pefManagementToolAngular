import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Interview } from '../../../../core/models/interview.model';
import { InterviewService } from '../../../../core/services/interview.service';
import { User } from '../../../../../app/core/models/user.model';
import { UserFilters, UserService } from '../../../../../app/core/services/user.service'; 
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-edit-interview',
  templateUrl: './edit-interview.component.html',
  styleUrls: ['./edit-interview.component.scss']
})
export class EditInterviewComponent implements OnInit {
  interviewForm: FormGroup;
  interview: Interview;
  candidates: any[]; 
  users: any[]; 
  @Output() interviewEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditInterviewComponent>,
    private interviewService: InterviewService,
    private userService: UserService,
    private candidateService: CandidateService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Interview
  ) {
    this.interview = { ...data };
  }
  ngOnInit() {
    const formattedTime = this.interview.interviewTime
      ? formatDate(this.interview.interviewTime, 'HH:mm', 'en')
      : formatDate(new Date().setHours(10, 0, 0), 'HH:mm', 'en'); // Default to 10:00 AM if no time is provided

    this.interviewForm = this.fb.group({
      candidate: [this.interview.candidate?.id || null, Validators.required],
      users: [this.interview.interviewLines?.map((line: any) => line.user.id), Validators.required],
      interviewDay: [this.interview.interviewDay || null, Validators.required],
      interviewTime: [formattedTime, Validators.required],
    });
  
    // Call getUsers and getCandidates functions to populate the dropdown menus
    this.getUsers();
    this.getCandidates();
    console.log(this.interview)
  }
  
  getInterviewErrorMessage(controlName: string): string {
    const control = this.interviewForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
    return '';
  }

  editInterview(): void {
    if (!this.interview || !this.interview.id) {
      console.error('Cannot edit interview: Invalid interview or ID is missing.');
      return;
    }

    if (this.interviewForm.valid) {
      const updatedInterview: Interview = {
        id: this.interview.id,
        candidate: this.interviewForm.get('candidate')?.value || null,
        users: this.interviewForm.get('users')?.value || [],
        interviewDay: this.interviewForm.get('interviewDay')?.value || null, 
        interviewTime: this.interviewForm.get('interviewTime')?.value || null,
        isActive: this.interview.isActive,
      };

      this.interviewService.updateInterview(this.interview.id, updatedInterview).subscribe(
        (updatedInterviewResponse: Interview) => {
          this.interviewService.interviewAdded.emit(updatedInterviewResponse);
          this.interviewEdited.emit(true);
          this.dialogRef.close(updatedInterviewResponse);
        },
        (error: any) => {
          console.error('Failed to update interview:', error);
          this.interviewEdited.emit(false);
        }
      );
    }
  }

    closeDialog(): void {
    this.dialogRef.close();
  }


  getUsers(): void {
  this.userService.getUsers(1, 50, {}).subscribe((users: User[]) => {
    this.users = users;
  });
}

  getCandidates(): void {
    this.candidateService.getCandidates(1, 50, {}).subscribe((candidates: Candidate[]) => {
      this.candidates = candidates;
    });
  }
}
