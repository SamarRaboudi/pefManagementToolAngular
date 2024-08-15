import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Limitation } from '../../../../core/models/limitation.model';
import { LimitationService } from '../../../../core/services/limitation.service';
import { User } from '../../../../../app/core/models/user.model';
import { UserFilters, UserService } from '../../../../../app/core/services/user.service'; 
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../../app/core/services/session.service';
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 

@Component({
  selector: 'app-add-limitation',
  templateUrl: './add-limitation.component.html',
  styleUrls: ['./add-limitation.component.scss']
})
export class AddLimitationComponent implements OnInit {
  limitationForm: FormGroup;
  users: User[] = [];
  sessions: Session[] = [];
  candidates: Candidate[] = [];
  @Output() limitationAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddLimitationComponent>,
    private limitationService: LimitationService,
    private userService: UserService,
    private sessionService: SessionService,
    private candidateService: CandidateService,
  ) { }

  ngOnInit() {
    this.limitationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      users: new FormControl([], Validators.required),
      session: new FormControl('', Validators.required),
      candidates: new FormControl([], Validators.required) 

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

  addLimitation(): void {
    if (this.limitationForm.valid) {
      const limitationData: Limitation = {
        name: this.limitationForm.value.name,
        users: this.limitationForm.value.users,
        candidates: this.limitationForm.value.candidates,
        session: this.limitationForm.value.session,
      };
      this.limitationService.addLimitation(limitationData).subscribe(
        (newLimitation: Limitation) => {
          this.limitationService.limitationAdded.emit(newLimitation);
          this.limitationAdded.emit(true); 
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add Limitation:', error);
          this.limitationAdded.emit(false); 
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
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
  

  getSessions(): void {
    this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
      this.sessions = sessions;
    });
  }
}
