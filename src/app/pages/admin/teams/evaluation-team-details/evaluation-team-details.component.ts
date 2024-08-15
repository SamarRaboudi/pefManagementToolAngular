import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Criteria } from '../../../../core/models/criteria.model';
import { CampaignService } from '../../../../core/services/campaign.service';
import { CriteriaService } from '../../../../core/services/criteria.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-evaluation-team-details',
  templateUrl: './evaluation-team-details.component.html',
  styleUrls: ['./evaluation-team-details.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EvaluationTeamDetailsComponent {

  panelOpenState = false;
  expandedRowIndex: number | null = null;
  expandedRowIndices: number[] = [];
  teamData: any; 
  teamId: number;
  evaluationCriteria: Criteria[] = [];
  columnsToDisplay: string[] = [];
  columnsToDisplayWithExpand: string[] = [];
  loading = true;
  selectedRemarks: { [key: number]: string } = {};
  constructor(private criteriaService: CriteriaService,
    private route: ActivatedRoute,
    private campaignService: CampaignService,

) {}

  ngOnInit(): void {
    this.fetchTeamEvaluationData();
    this.getEvaluationCriteria();
  }

  getEvaluationCriteria(): void {
    this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
      this.evaluationCriteria = criterias || []; // Ensure evaluationCriteria is initialized
      this.columnsToDisplay = ['Evaluator', ...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[], 'Final Note'];
      this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  
    });
  }

  fetchTeamEvaluationData(): void {
    this.route.params.subscribe(params => {
      this.teamId = params['teamId'];
 
    });
    this.campaignService.getTeamAllEvaluationData(this.teamId).subscribe(
      (data: any) => {
        this.teamData = data;
        this.loading = false;
      },
      error => {
        console.error('Error fetching team evaluation data:', error);
        this.loading = false;
      }
    );
  }
  
  toggleRemark(candidateId: number, remark: string): void {
    this.selectedRemarks[candidateId] = remark; // Set selected remark for the candidate
  }

  getSelectedRemark(candidateId: number): string {
    return this.selectedRemarks[candidateId] || ''; // Get selected remark for the candidate
  }

  isCampaignFinished(endDate: string): boolean {
    const today = new Date();
    const campaignEndDate = new Date(endDate);
    return campaignEndDate < today;
}

isCampaignInProgress(startDate: string, endDate: string): boolean {
    const today = new Date();
    const campaignStartDate = new Date(startDate);
    const campaignEndDate = new Date(endDate);
    return campaignStartDate <= today && today <= campaignEndDate;
}

isCampaignNotStartedYet(startDate: string): boolean {
    const today = new Date();
    const campaignStartDate = new Date(startDate);
    return campaignStartDate > today;
}

toggleRowExpansion(index: number): void {
  const currentIndex = this.expandedRowIndices.indexOf(index);
  if (currentIndex === -1) {
    this.expandedRowIndices.push(index);
  } else {
    this.expandedRowIndices.splice(currentIndex, 1);
  }
}

isRowExpanded(index: number): boolean {
  return this.expandedRowIndices.includes(index);
}
isFirstPanel(index: number): boolean {
  return index === 0; 
}
}
