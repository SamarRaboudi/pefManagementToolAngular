import { Component, OnInit } from '@angular/core';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { CampaignFilters, CampaignService } from '../../../../core/services/campaign.service';
import { Campaign } from '../../../../core/models/campaign.model';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { EvaluationValidationComponent } from '../evaluation-validation/evaluation-validation.component';
import { EvaluationCofirmationComponent } from '../evaluation-cofirmation/evaluation-cofirmation.component';

@Component({
    selector: 'app-view-campaign',
    templateUrl: './view-campaign.component.html',
    styleUrls: ['./view-campaign.component.scss'],
    providers: [DatePipe],
})
export class ViewCampaignComponent implements OnInit {
    panelOpenState = false;
    campaignId: number;
    campaign: Campaign | null = null;
    teamsData: any;
    teamsDataArray: any;
    evaluatorsForm: FormGroup;
    dateForm: FormGroup;
    evaluators: User[] = [];
    showEvaluatorsForm: boolean = false;
    minDate: Date;
    maxDate: Date;
    campaignName: string = 'Campaign 4';
    loading = true;
    

    // Define project colors
    projectColors: string[] = ['accent', 'success', 'warning'];

    constructor(
        private userService: UserService,
        private campaignService: CampaignService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private dialog: MatDialog
    ) {
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear - 20, 0, 1);
        this.maxDate = new Date(currentYear + 1, 11, 31);
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.campaignId = params['id'];
            this.fetchCampaignData();
        });
        this.evaluatorsForm = new FormGroup({
            selectedEvaluator: new FormControl(null, Validators.required)
        });
        this.dateForm = new FormGroup({
            day: new FormControl('', Validators.required),
        });

        this.getEvaluators();
        const currentDate = new Date();
        this.minDate = currentDate;
        this.maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    }

    fetchCampaignData(): void {
      this.campaignService.getCampaignById(this.campaignId).subscribe(
          (response: any) => {
              if (response && response.campaign) {
                  this.campaign = response.campaign;
                  this.teamsData = response.teams;
                  this.teamsDataArray = Object.values(this.teamsData);
  
                  // Call getEvaluatorsForTeam for each team
                  this.teamsDataArray.forEach((team: any) => {
                      this.getEvaluatorsForTeam(team);
                    
                  });
              } else {
                  console.error('Campaign with ID', this.campaignId, 'not found.');
              }
              this.loading = false;
          },
          (error) => {
              console.error('Error fetching campaign data:', error);
              this.loading = false;
          }
      );
  }


    // Method to determine the text color class based on start date
    getTextColor(startDate: string): string {
        const uniqueStartDates = Array.from(new Set(this.teamsDataArray.map((team: any) => team.evaluationDate)));
        const colorIndex = uniqueStartDates.indexOf(startDate) % this.projectColors.length;
        return this.projectColors[colorIndex];
    }

    // Method called when the panel is opened
    panelOpened(index: number): void {
        this.teamsDataArray[index].panelOpen = true;
    }

    // Method called when the panel is closed
    panelClosed(index: number): void {
        this.teamsDataArray[index].panelOpen = false;
    }

    getEvaluators(): void {
      const evaluatorFilter: UserFilters = {
          searchQuery: 'evaluator'
      };
  
      this.userService.getUsers(1, 50, evaluatorFilter).subscribe((evaluators: User[]) => {
          this.teamsDataArray.forEach((team: any) => {
              const supervisorIds = team.projectSupervisors.map((supervisor: any) => supervisor.id);
              // Filter out evaluators who are supervisors of the current team
              team.evaluators = evaluators.filter(evaluator => !supervisorIds.includes(evaluator.id));
          });
      });
  }

  getEvaluatorsForTeam(team: any): void {
    const evaluatorFilter: UserFilters = {
        searchQuery: 'evaluator'
    };

    this.userService.getUsers(1, 50, evaluatorFilter).subscribe((evaluators: User[]) => {
        // Filter out evaluators who are supervisors of the current team
        const supervisorIds = team.projectSupervisors.map((supervisor: any) => supervisor.id);
        team.evaluatorsToUpdate = evaluators.filter(evaluator =>
            !supervisorIds.includes(evaluator.id)
        );
    });
}


  

    editEvaluator(evaluator: any): void {
        evaluator.editing = true;
    }

    onEvaluatorSelected(selectedEvaluator: User, evaluator: any): void {
        evaluator.selectedEvaluator = selectedEvaluator;
    }

    updateEvaluator(selectedEvaluator: User, evaluator: any): void {
        evaluator.id = selectedEvaluator.id;
        evaluator.nom = selectedEvaluator.nom;
        evaluator.prenom = selectedEvaluator.prenom;
        evaluator.email = selectedEvaluator.email;
        evaluator.picture = selectedEvaluator.picture;
        evaluator.editing = false;
        const selectedEvaluatorControl = this.evaluatorsForm.get('selectedEvaluator');
        if (selectedEvaluatorControl) {
            selectedEvaluatorControl.setValue(null);
        }
    }
    
    updateEvaluationDate(selectedDate: Date, team: any): void {
        const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
        team.evaluationDate = formattedDate;
    }
    
    onTimeChange(event: any, team: any): void {
        const time = (event.target as HTMLInputElement).value;
        team.evaluationTime = time;
    }

    openSuccessSavingCampaignModal(campaignName: string, sessionName: string): void {
        const dialogRef = this.dialog.open(EvaluationValidationComponent, {
          width: '500px',
          data: `${campaignName} of ${sessionName} is successfully saved!`
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Proceed with validation logic
           
          }
        });
      }
    
    
    saveTeamData(): void {
        const updatedCampaign: any = {
            name: this.campaignName,
            startDate: this.datePipe.transform(this.campaign?.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
            endDate: this.datePipe.transform(this.campaign?.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
            isActive: true,
            isValid: false,
            session: this.campaign?.sessionId,
            // Add other campaign properties here if needed
            teamsEvaluators: {} as { [teamId: string]: any }
        };
    
        this.teamsDataArray.forEach((team: any) => {
            const teamId = team.id; 
            const evaluationDate = team.evaluationDate; 
            const evaluationTime = team.evaluationTime;
            const evaluatorIds = team.evaluators.map((evaluator: any) => evaluator.id); 
            const supervisorIds = team.projectSupervisors.map((supervisor: any) => supervisor.id);
            const allIds = [...evaluatorIds, ...supervisorIds];
    
            let formattedEvaluationTime: string;
    
            // Check if evaluationTime contains "T" and "-"
            if (evaluationTime.includes("T") && evaluationTime.includes("-")) {
                // If it's in "YYYY-MM-DDTHH:mm:ss" format, extract the time part
                formattedEvaluationTime = evaluationTime.substring(11, 19);
            } else {
                // If it's in "HH:mm" format, ensure it's in "HH:mm:ss" format
                formattedEvaluationTime = evaluationTime.includes(":")
                    ? evaluationTime + ":00"
                    : evaluationTime;
            }
    
            updatedCampaign.teamsEvaluators[teamId] = {
                evaluationDate,
              //  evaluationTime: formattedEvaluationTime,
              evaluators: allIds
            };
        });
    
        // Call the updateCampaign method of CampaignService to send the updated campaign data to the server
        this.campaignService.updateCampaign(this.campaignId, updatedCampaign).subscribe(
            (updatedCampaign: Campaign) => {
                if (this.campaign && this.campaign.sessionName && this.campaign.name) {
                    this.openSuccessSavingCampaignModal(this.campaign.name, this.campaign.sessionName);
                  } 
            },
            (error) => {
                // Handle error
                console.error('Error updating campaign:', error);
            }
        );
    }
    

    openConfirmationModal(campaignName: string, sessionName: string): void {
        const dialogRef = this.dialog.open(EvaluationCofirmationComponent, {
          width: '500px',
          data: `Are you sure you want to validate the ${campaignName} of ${sessionName}?`
        });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.handleConfirmation();
          }
        });
      }
      
      handleConfirmation(): void {
        const updatedCampaign: any = {
            name: this.campaignName,
            startDate: this.datePipe.transform(this.campaign?.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
            endDate: this.datePipe.transform(this.campaign?.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss'), 
            isActive: true,
            isValid: true,
            session: this.campaign?.sessionId,
            // Add other campaign properties here if needed
            teamsEvaluators: {} as { [teamId: string]: any }
        };
    
        this.teamsDataArray.forEach((team: any) => {
            const teamId = team.id; 
            const evaluationDate = team.evaluationDate; 
            const evaluationTime = team.evaluationTime;
            const evaluatorIds = team.evaluators.map((evaluator: any) => evaluator.id); 
            const supervisorIds = team.projectSupervisors.map((supervisor: any) => supervisor.id);
            const allIds = [...evaluatorIds, ...supervisorIds];
    
            let formattedEvaluationTime: string;
    
            // Check if evaluationTime contains "T" and "-"
            if (evaluationTime.includes("T") && evaluationTime.includes("-")) {
                // If it's in "YYYY-MM-DDTHH:mm:ss" format, extract the time part
                formattedEvaluationTime = evaluationTime.substring(11, 19);
            } else {
                // If it's in "HH:mm" format, ensure it's in "HH:mm:ss" format
                formattedEvaluationTime = evaluationTime.includes(":")
                    ? evaluationTime + ":00"
                    : evaluationTime;
            }
    
            updatedCampaign.teamsEvaluators[teamId] = {
                evaluationDate,
             //   evaluationTime: formattedEvaluationTime,
             evaluators: allIds
            };
        });
        this.campaignService.updateCampaign(this.campaignId, updatedCampaign).subscribe(
            (updatedCampaign: Campaign) => {
                if (this.campaign && this.campaign.sessionName && this.campaign.name) {
                    this.openSuccessSavingCampaignModal(this.campaign.name, this.campaign.sessionName);
                  } 
            },
            (error) => {
                // Handle error
                console.error('Error updating campaign:', error);
            }
        );
      }



  
}
