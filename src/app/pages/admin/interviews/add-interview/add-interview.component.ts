import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Interview } from '../../../../core/models/interview.model';
import { InterviewService } from '../../../../core/services/interview.service';
import { User } from '../../../../../app/core/models/user.model';
import { UserFilters, UserService } from '../../../../../app/core/services/user.service'; 
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent implements OnInit {
  interviewForm: FormGroup;
  users: User[] = [];
  candidates: Candidate[] = [];
  @Output() interviewAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddInterviewComponent>,
    private interviewService: InterviewService,
    private userService: UserService,
    private candidateService: CandidateService,
  ) { }

  ngOnInit() {
    this.interviewForm = new FormGroup({
      users: new FormControl([], Validators.required),
      candidate: new FormControl('', Validators.required),
      interviewDay: new FormControl('', Validators.required),
      interviewTime: new FormControl('', Validators.required) 

    });

    this.getUsers(); 
    this.getCandidates();
  }


  getuserErrorMessage(userControl: any): string {
    if (userControl?.hasError('required')) {
      return 'Interviewer is required.';
    }
    return '';
  }

  getcandidateErrorMessage(candidateControl: any): string {
    if (candidateControl?.hasError('required')) {
      return 'Candidate is required.';
    }
    return '';
  }




  addInterview(): void {
    if (this.interviewForm.valid) {
      const interviewDay = formatDate(this.interviewForm.value.interviewDay, 'yyyy-MM-dd', 'en-US');
      
      const interviewTime = this.interviewForm.value.interviewTime ? this.interviewForm.value.interviewTime + ':00' : null;
    
      const interviewLines = this.interviewForm.value.users.map((userId: any) => ({
        user: userId,
      }));
  
      const interviewData: Interview = {
        candidate: this.interviewForm.value.candidate,
        interviewDay: interviewDay,
        interviewTime: interviewTime, 
        interviewLines: interviewLines, 
        users: this.interviewForm.value.users,
      };
  
      this.interviewService.addInterview(interviewData).subscribe(
        (newInterview: Interview) => {
          this.interviewService.interviewAdded.emit(newInterview);
          this.interviewAdded.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add Interview:', error);
          this.interviewAdded.emit(false);
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
