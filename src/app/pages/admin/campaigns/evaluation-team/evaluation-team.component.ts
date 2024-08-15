import { Component, OnInit } from '@angular/core';
import { Criteria } from '../../../../core/models/criteria.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { TeamFilters, TeamService } from '../../../../core/services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Team } from '../../../../core/models/team.model';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { CampaignService } from '../../../../core/services/campaign.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationCofirmationComponent } from '../evaluation-cofirmation/evaluation-cofirmation.component';
import { EvaluationValidationComponent } from '../evaluation-validation/evaluation-validation.component';

export interface EvaluationCriteria {
  [key: number]: number | string | undefined; 
  noteFinale: number;
  
}

export interface CandidateEvaluationData {
  candidate_id: number;
  score: number;
  criteria: { [key: number]: number };
  remark: string; 
}




@Component({
  selector: 'app-evaluation-team',
  templateUrl: './evaluation-team.component.html',
  styleUrls: ['./evaluation-team.component.scss']
})
export class EvaluationTeamComponent implements OnInit {
  panelOpenState = false;
  isMyTeam: string;
  team: Team;
  teamData: any;
  candidatesData: any;
  teamId: number;
  campaignId: number;
  userEmail: string;
  user: User;
  evaluationCriteria: Criteria[] = [];
  evaluationCriteriaData: EvaluationCriteria[] = [];
  displayedColumns: string[] = [];
  loading = true;
  candidateEvaluationData: CandidateEvaluationData[][] = [];

  criteria = {
    "Communication": 2,
    "Presentation Quality": 4,
    "Mastery of the Subject": 4,
    "Deliverable Quality": 3,
    "Technical Level": 2
  };
  notes = [
    "you have a low test coverage rate on your code",
    "you try to answer questions even if you don't know the answer"
  ];
  advice: string;

  constructor(private criteriaService: CriteriaService,
              private teamService: TeamService,
              private route: ActivatedRoute,
              private userService: UserService,
              private campaignService: CampaignService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'];
      this.campaignId = params['campaignId'];
    });

    this.fetchUser();
    //this.getAdvice();

  }

  getAdvice(): void {
    this.campaignService.generateAdvice(this.criteria, this.notes).subscribe(
      response => {
        this.advice = response.result;
        console.log('advice: ',this.advice)
      },
      error => {
        console.error('There was an error!', error);
      }
    );
  }

  fetchUser(): void {
    this.userEmail = localStorage.getItem('loggedInUserEmail') || '';
    const filters: UserFilters = {
      searchQuery:  this.userEmail
    };

    this.userService.getUsers(1, 1, filters).subscribe(
      (data: any) => {
        this.user = data[0]; 
        this.getEvaluationCriteria(); 
        if(this.user && this.user.id)
          {
            this.getTeamEvaluationData(this.campaignId, this.teamId, this.user.id);
          }
        
       
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }

  getEvaluationCriteria(): void {
    let profilTitre: string; 
    this.route.params.subscribe(params => {
      this.isMyTeam = params['isMyTeam'];
    });
  
    if (this.isMyTeam === '0') {
      profilTitre = "Evaluator"; 
    } else if (this.isMyTeam === '1') {
      profilTitre = "Supervisor"; 
    } else {
      console.error('Invalid value for isMyTeam:', this.isMyTeam);
      return;
    }
  
    this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
      this.evaluationCriteria = criterias.filter(criteria =>
        criteria.profils?.some(profile => profile.titre === profilTitre)
      );
      this.displayedColumns = [...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[], 'finalNote'];
    });
  }
  




updateCriterionValue(candidateData: CandidateEvaluationData, criteriaId: number, value: number): void {
  const foundCandidateData = this.candidateEvaluationData.find(data => data[0].candidate_id === candidateData.candidate_id);
  if (foundCandidateData) {
    foundCandidateData[0].criteria[criteriaId] = value;
    this.calculateFinalNote();
  }
}

calculateFinalNote(): void {
  for (const candidateData of this.candidateEvaluationData) {
    for (const evaluationData of candidateData) {
      let sum = 0;
      let sumOfCoefficients = 0; 
      
      for (const criteria of this.evaluationCriteria) {
        if (criteria.id && typeof criteria.id === 'number') {
          const value = (evaluationData.criteria && evaluationData.criteria[criteria.id]) || 0;
          const coefficient = criteria.value || 1; 
          if (typeof value === 'number') {
            sum += value * coefficient;
            sumOfCoefficients += coefficient; 
          }
          const criteriaValue = value;
          evaluationData.criteria[criteria.id] = criteriaValue;
        }
      }

      evaluationData.score = sumOfCoefficients ? sum / sumOfCoefficients : 0;
    }
  }
}



  validateEvaluation(): void {
    let hasIncompleteEvaluation = true;
  
    for (const candidateData of this.candidateEvaluationData) {
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
  
    if (this.teamData && this.teamData.teamName) {
      this.openConfirmationModal(this.teamData.teamName);
    } else {
      console.error('Error: Team name is undefined');
    }
  }
  

  openConfirmationModal(teamName: string): void {
    const dialogRef = this.dialog.open(EvaluationCofirmationComponent, {
      width: '500px',
      data: `Are you sure you want to submit the evaluation for ${teamName}?`
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleConfirmation();
      }
    });
  }
  handleConfirmation(): void {
    const formattedData: any[] = [];
  
    // Validate if teamData and candidatesData are available
    if (this.teamData && this.candidatesData) {
      // Iterate through candidatesData to gather evaluation data
      for (const candidate of this.candidatesData) {
        if (candidate.id !== undefined) {
          // Find candidate evaluation data based on candidate.id
          const candidateData = this.candidateEvaluationData.find(data => data[0].candidate_id === candidate.id);
          if (candidateData) {
            // Format evaluation data
            const evaluationData = {
              candidate_id: candidate.id,
              score: candidateData[0].score,
              remark: candidateData[0].remark,
              criteria: candidateData[0].criteria
            };
            formattedData.push(evaluationData); // Push formatted data into formattedData array
          }
        }
      }
    }
  
    // Validate if user and campaignId are available
    if (this.user && this.campaignId) {
      // Construct requestData object
      const requestData = {
        isValidated: true,
        campaign_id: this.campaignId,
        user_id: this.user.id,
        candidates_data: formattedData // Assign formattedData to candidates_data
      };
  
      // Call campaignService to update evaluation scores and grades
      this.campaignService.updateEvaluationScoresAndGrades(requestData).subscribe(
        response => {
          console.log("response", response);
          if (this.teamData && this.teamData.teamName) {
            if (response.results && response.results.length > 0) {
              // Map response results to resultsArray with necessary properties
              const resultsArray: any[] = response.results.map((result: any) => ({
                advice: result.advice,
                campaign_id: result.campaign_id,
                session_name: result.session.name,
                campaign_name: result.campaign_name,
                candidate_id: result.candidate_id,
                criteria_averages: result.criteria_averages,
                email: result.email,
                evaluation_date: result.evaluation_date,
                evaluation_time: result.evaluation_time,
                first_name: result.first_name,
                last_name: result.last_name,
                remarks: result.remarks
              }));
  
              // Process each candidate in resultsArray
              resultsArray.forEach((candidate: any) => {
                const criteria = candidate.criteria_averages;
                const notes = candidate.remarks;
  
                // Generate advice for the candidate
                this.campaignService.generateAdvice(criteria, notes).subscribe(
                  adviceResponse => {
                    // Add advice to candidate object
                    candidate.advice = adviceResponse.result;
  
                    // Check if all candidates have advice
              
                      // Check if all candidates still have advice
                      if (resultsArray.every((res: any) => res.advice)) {
                        // Send the advice results after all candidates have advice
                        console.log('Sending advice results:', { results: resultsArray });
                        this.campaignService.sendAdviceResults({ results: resultsArray }).subscribe(
                          sendResponse => {
                            console.log('Advice results sent successfully:', sendResponse);
                          },
                          sendError => {
                            console.error('Error sending advice results:', sendError);
                          }
                        );
                      }
               
                  },
                  adviceError => {
                    console.error('Error generating advice:', adviceError);
                  }
                );
              });
            }
            this.openSuccessEvaluationModal(this.teamData.teamName); // Open success modal if team name is defined
          } else {
            console.error('Error: Team name is undefined');
          }
        },
        error => {
          console.error('Error updating evaluation scores and grades:', error);
        }
      );
    } else {
      console.error('Error: user or campaignId is undefined');
    }
  }
  
  

  
  
  
  openSuccessEvaluationModal(teamName: string): void {
    const dialogRef = this.dialog.open(EvaluationValidationComponent, {
      width: '500px',
      data: `Evaluation for ${teamName} is successfully done!`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {       
      }
    });
  }

   
  openSuccessSavingEvaluationModal(teamName: string): void {
    const dialogRef = this.dialog.open(EvaluationValidationComponent, {
      width: '500px',
      data: `Evaluation for ${teamName} is successfully saved!`
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  getTeamEvaluationData(campaignId: number, teamId: number, evaluatorId: number){
    this.campaignService.getTeamEvaluationData(campaignId, teamId, evaluatorId)
    .subscribe(
      (data) => {
        this.teamData = data[0].teamData;
        this.candidatesData = data[0].candidatesData;
        if (this.candidatesData) {
          this.candidateEvaluationData = this.candidatesData.map((candidate: any) => {
            const candidateId: number = candidate.id || -1;            
            const evaluationData: CandidateEvaluationData = {
              candidate_id: candidate.id,
              score: candidate.evaluation.score, 
              remark: candidate.evaluation.remark, 
              criteria: candidate.evaluationLineCriteriaGrades.length !== 0 ? 
                        candidate.evaluationLineCriteriaGrades : 
                        this.generateEmptyCriteriaObject()
            };
            return [evaluationData]; 
         
           
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

generateEmptyCriteriaObject(): { [key: number]: number | null } {
    const emptyCriteriaObject: { [key: number]: number | null } = {};
    this.evaluationCriteria.forEach(criteria => {
        if (criteria.id && typeof criteria.id === 'number') {
            emptyCriteriaObject[criteria.id] = null;
        }
    });
    return emptyCriteriaObject;
}

saveEvaluation(){
  const formattedData: any[] = [];
  
  if (this.teamData && this.candidatesData) {
    for (const candidate of this.candidatesData) {
      if (candidate.id !== undefined) {
        const candidateData = this.candidateEvaluationData.find(data => data[0].candidate_id === candidate.id);
        if (candidateData) {
          const evaluationData = {
            candidate_id: candidate.id,
            score: candidateData[0].score,
            remark: candidateData[0].remark,
            criteria: candidateData[0].criteria
          };
          formattedData.push(evaluationData);
        }
      }
    }
  }

  if (this.user && this.campaignId) {
    const requestData = {
      isValidated: false,
      campaign_id: this.campaignId,
      user_id: this.user.id,
      candidates_data: formattedData
    };
    this.campaignService.updateEvaluationScoresAndGrades(requestData).subscribe(
      response => {
        if (this.teamData && this.teamData.teamName) {
          this.openSuccessSavingEvaluationModal(this.teamData.teamName);
        } else {
          console.error('Error: Team name is undefined');
        }
      },
      error => {
        console.error('Error updating evaluation scores and grades:', error);
      }
    );
  } else {
    console.error('Error: user or campaignId is undefined');
  }
}


}
