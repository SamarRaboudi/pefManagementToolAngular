import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { InterviewService, InterviewFilters } from '../../../../core/services/interview.service';
import { Interview } from '../../../../../app/core/models/interview.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Criteria } from '../../../../core/models/criteria.model';
import { User } from '../../../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { InterviewValidationComponent } from '../interview-validation/interview-validation.component';
import { InterviewConfirmationComponent } from '../interview-confirmation/interview-confirmation.component';

export interface EvaluationCriteria {
  [key: number]: string | string | undefined; 
}

export interface CandidateInterviewData {
  candidate_id: number;
  criteria: { [key: number]: string };
  remark: string; 
}

@Component({
  selector: 'app-evaluation-interview',
  templateUrl: './evaluation-interview.component.html',
  styleUrls: ['./evaluation-interview.component.scss']
})

export class EvaluationInterviewComponent  {
  panelOpenState = false;
  candidatesData: any;
  teamId: number;
  userEmail: string;
  user: User;
  evaluationCriteria: Criteria[] = [];
  evaluationCriteriaData: EvaluationCriteria[] = [];
  displayedColumns: string[] = [];
  loading = true;
  candidateInterviewData: CandidateInterviewData[][] = [];
  interviewId: any;
  candidateId: any;


  

  constructor(private criteriaService: CriteriaService,
              private route: ActivatedRoute,
              private userService: UserService,
              private interviewService: InterviewService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    this.interviewId = +params['id']; 


    });

    this.fetchUser();
    

  }

  fetchUser(): void {
    this.userEmail = localStorage.getItem('loggedInUserEmail') || '';
    const filters: UserFilters = {
      searchQuery:  this.userEmail
    };

    // Call the user service to get the user
    this.userService.getUsers(1, 1, filters).subscribe(
      (data: any) => {
        this.user = data[0]; 
        this.getEvaluationCriteria(); 
        if(this.user && this.user.id)
          {
            this.getInterviewData(this.interviewId,this.user.id);
          }
        
       
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  getEvaluationCriteria(): void {
    this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
      this.evaluationCriteria = criterias;
      this.displayedColumns = [...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[]];
    });

  }
  getInterviewData(interviewId: number, userId: number): void {
    this.interviewService.getInterviewData(interviewId, userId).subscribe(
      (data: any) => {
        this.candidatesData = data[0].candidatesData;
        if (this.candidatesData) {
          this.candidateInterviewData = this.candidatesData.map((candidate: any) => {
            const interviewData: CandidateInterviewData = {
              candidate_id: candidate.id,
              remark: candidate.interview.remark,
              criteria: candidate.interviewLineCriteriaGrades.length !== 0 ?
                candidate.interviewLineCriteriaGrades : this.generateEmptyCriteriaObject()
            };
            return [interviewData];
          });
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

 
  
  

   
updateCriterionValue(candidateData: CandidateInterviewData, criteriaId: number, value: string): void {
  const foundCandidateData = this.candidateInterviewData.find(data => data[0].candidate_id === candidateData.candidate_id);
  if (foundCandidateData) {
    foundCandidateData[0].criteria[criteriaId] = value;
  }
}
generateEmptyCriteriaObject(): { [key: number]: string | null } {
    const emptyCriteriaObject: { [key: number]: string | null } = {};
    this.evaluationCriteria.forEach(criteria => {
        if (criteria.id && typeof criteria.id === 'number') {
            emptyCriteriaObject[criteria.id] = null;
        }
    });
    return emptyCriteriaObject;
}


saveEvaluation(): void {
  const formattedData: any[] = [];

  if (this.candidatesData) {
    for (const candidate of this.candidatesData) {
      if (candidate.id !== undefined) {
        const candidateData = this.candidateInterviewData.find(data => data[0].candidate_id === candidate.id);
        if (candidateData) {
          const evaluationData = {
            candidate_id: candidate.id,
            remark: candidateData[0].remark,
            criteria: candidateData[0].criteria
          };
          formattedData.push(evaluationData);
        }
      }
    }
  }

  if (this.user && this.interviewId) {
    const requestData = {
      isValidated: false,
      interview_id: this.interviewId,
      user_id: this.user.id,
      candidates_data: formattedData
    };
    this.interviewService.updateInterviewScoresAndGrades(requestData).subscribe(
      response => {
        this.openSuccessSavingInterviewModal();
      },
      error => {
        console.error('Error updating evaluation scores and grades:', error);
      }
    );
  } else {
    console.error('Error: user or interviewId is undefined');
  }
}


validateEvaluation(): void {
  let hasIncompleteEvaluation = true;

  for (const candidateData of this.candidateInterviewData) {
    for (const evaluationData of candidateData) {        
      for (const key in evaluationData.criteria) {
        if (evaluationData.criteria.hasOwnProperty(key)) {
          if (evaluationData.criteria[key] === null) {
            hasIncompleteEvaluation = false;
            break; 
          }
        }
      }

      if (!hasIncompleteEvaluation) {
        break;
      }
    }
    if (!hasIncompleteEvaluation) {
      break; 
    }
  }

  if (!hasIncompleteEvaluation) {
    this.snackBar.open('Please fill out all evaluation criteria for all candidates', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    return; 
  }

  this.handleConfirmation();
}

handleConfirmation(): void {
  const formattedData: any[] = [];

  if (this.candidatesData) {
    for (const candidate of this.candidatesData) {
      if (candidate.id !== undefined) {
        const candidateData = this.candidateInterviewData.find(data => data[0].candidate_id === candidate.id);
        if (candidateData) {
          const evaluationData = {
            candidate_id: candidate.id,
            remark: candidateData[0].remark,
            criteria: candidateData[0].criteria
          };
          formattedData.push(evaluationData);
        }
      }
    }
  }

  if (this.user && this.interviewId) {
    const requestData = {
      isValidated: true,
      interview_id: this.interviewId,
      user_id: this.user.id,
      candidates_data: formattedData
    };
    this.interviewService.updateInterviewScoresAndGrades(requestData).subscribe(
      response => {
        this.openSuccessInterviewModal();
      },
      error => {
        console.error('Error updating interview scores and grades:', error);
      }
    );
  } else {
    console.error('Error: user or interviewId is undefined');
  }
}

openConfirmationModal(): void {

  const dialogRef = this.dialog.open(InterviewConfirmationComponent, {
    width: '500px',
    data: `Are you sure you want to submit the interview?`
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.handleConfirmation();
    }
  });
}

openSuccessInterviewModal(): void {
  const dialogRef = this.dialog.open(InterviewValidationComponent, {
    width: '500px',
    data: `Interview is successfully done!`
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
    }
  });
}

openSuccessSavingInterviewModal(): void {

  const dialogRef = this.dialog.open(InterviewValidationComponent, {
    width: '500px',
    data: `Interview is successfully saved!`
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Proceed with validation logic
    }
  });
}
openCandidateDetailsInNewTab(candidateId: number): void {
  const url = `/dashboard/admin/candidates/${candidateId}`;
  window.open(url, '_blank');
}



}
