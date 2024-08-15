import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { InterviewService, InterviewFilters } from '../../../../core/services/interview.service';
import { Interview } from '../../../../../app/core/models/interview.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Criteria } from '../../../../core/models/criteria.model';


@Component({
  selector: 'app-view-interview',
  templateUrl: './view-interview.component.html',
  styleUrls: ['./view-interview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewInterviewComponent implements OnInit {
  interview: Interview;
  interviewData:any;
  interviewId: number;
  photoLink: any;
  loading = true;
  evaluationCriteria: Criteria[] = [];
  displayedColumns: string[] = [];
  selectedRemarks: { [key: number]: string } = {};
  columnsToDisplay: string[] = [];
  columnsToDisplayWithExpand: string[] = [];
  scores: number[] = [];
  expandedRowIndex: number | null = null;
  expandedRowIndices: number[] = [];
  basicData: any;
  basicOptions: any;
  chartData: any;
  chartOptions: any;
  colors: string[] = ['#BBD0FF', '#FFE3B4', '#B7E6FF', '#FFC7B5', '#e6fffa', '#ffe5ec', '#00C851'];


  constructor(private route: ActivatedRoute, 
              private interviewService: InterviewService,
              private criteriaService: CriteriaService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.interviewId = +params['id']; 
      this.fetchCandidateInterviewData();
    });
    this.getEvaluationCriteria();
  }



getEvaluationCriteria(): void {
  this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
    this.evaluationCriteria = criterias || []; // Ensure evaluationCriteria is initialized
    this.columnsToDisplay = ['User', ...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[]];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  });
}


fetchCandidateInterviewData(): void {
  this.interviewService.getCandidateInterviewData(this.interviewId).subscribe(
    (data: Interview[]) => {
      this.interviewData = data;
      this.loading = false;
      for(let i=0 ; i<this.interviewData.length; i++){
  
      }
    },
    (error: any) => {
      console.error('Error fetching candidate interview data:', error);
      this.loading = false;
    }
  );
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
openCandidateDetailsInNewTab(candidateId: number): void {
  const url = `/dashboard/admin/candidates/${candidateId}`;
  window.open(url, '_blank');
}

}
