import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Limitation } from '../../../../../app/core/models/limitation.model';
import { LimitationService } from '../../../../core/services/limitation.service';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { User } from '../../../../../app/core/models/user.model';
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../../app/core/services/session.service';
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 

@Component({
  selector: 'app-edit-limitation',
  templateUrl: './edit-limitation.component.html',
  styleUrls: ['./edit-limitation.component.scss']
})
export class EditLimitationComponent implements OnInit {
  limitationForm: FormGroup;
  limitation: Limitation;
  limitationId: number;
  users: User[] = [];
  sessions: Session[] = [];
  candidates: Candidate[] = [];
  userId: any[];
  @Output() limitationEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditLimitationComponent>,
    private limitationService: LimitationService,
    private userService: UserService,
    private sessionService: SessionService,
    private candidateService: CandidateService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Limitation
  ) {
    this.limitation = { ...data };
    this.userId = []; 
  }

  ngOnInit() {
    this.limitationForm = this.fb.group({
      name: [this.limitation.name, Validators.required],
      users: [this.limitation.users ? this.limitation.users.map(user => user.id) : null, Validators.required],
      candidates: [this.limitation.candidates ? this.limitation.candidates.map(candidate => candidate.id) : null, Validators.required],
      session: [this.limitation.session ? this.limitation.session.id : null, Validators.required],
    });


    this.getEvaluators(); 
    this.getSessions();
    this.getCandidates();
  }

  getnameErrorMessage(NameControl: any): string {
    if (NameControl?.hasError('required')) {
      return 'Name is required.';
    }
    return '';
  }


  getuserErrorMessage(userControl: any): string {
    if (userControl?.hasError('required')) {
      return 'User is required.';
    }
    return '';
  }

  getcandidateErrorMessage(candidateControl: any): string {
    if (candidateControl?.hasError('required')) {
      return 'Candidate is required.';
    }
    return '';
  }

  getsessionErrorMessage(sessionControl: any): string {
    if (sessionControl?.hasError('required')) {
      return 'session is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editLimitation(): void {
    if (!this.limitation || !this.limitation.id) {
      console.error('Cannot edit limitation: Invalid limitation or ID is missing.');
      return;
    }

    if (this.limitationForm.valid) {
      const updatedLimitation: Limitation = {
        name: this.limitationForm.get('name')?.value,
        users: this.limitationForm.get('users')?.value,
        session: this.limitationForm.get('session')?.value, 
        candidates: this.limitationForm.get('candidates')?.value, 
        isActive: this.limitation.isActive,
      };

      this.limitationService.updateLimitation(this.limitation.id, updatedLimitation).subscribe(
        (updatedLimitationResponse: Limitation) => {
          this.limitationService.limitationAdded.emit(updatedLimitationResponse);
          this.limitationEdited.emit(true); 
          this.dialogRef.close(updatedLimitationResponse);
        },
        (error: any) => {
          console.error('Failed to update limitation:', error);
          this.limitationEdited.emit(false); 
        }
      );
    }
  }
  
  
  getSessions(): void {
    this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
      this.sessions = sessions;
    });
  }


  

  getEvaluators(): void {
    const evaluatorFilter: UserFilters = {
      searchQuery: 'Evaluator' 
    };
  
    this.userService.getUsers(1, 50, evaluatorFilter).subscribe((users: User[]) => {
      this.users = users.map(user => ({ ...user, selected: false }));
    });
  }

  getCandidates(): void {
    this.candidateService.getCandidates(1, 50, {}).subscribe((candidates: Candidate[]) => {
      this.candidates = candidates;
    });
  }
  
}