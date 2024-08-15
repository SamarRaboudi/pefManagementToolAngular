import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { InterviewService, InterviewFilters } from '../../../../core/services/interview.service';
import { Interview } from '../../../../../app/core/models/interview.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Criteria } from '../../../../core/models/criteria.model';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../core/models/session.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-interview',
  templateUrl: './list-interview.component.html',
  styleUrls: ['./list-interview.component.scss'],
})
export class ListInterviewComponent implements OnInit {
  interview: Interview;
  interviewData:any;
  interviewId: number;
  photoLink: any;
  loading = true;
  evaluationCriteria: Criteria[] = [];
  displayedColumns: string[] = [];
  selectedRemarks: { [key: number]: string } = {};
  columnsToDisplay: string[] = [];
  columnsToDisplayWithExpand: string[] = []
  chartData: any;
  chartOptions: any;
  colors: string[] = ['#BBD0FF', '#FFE3B4', '#B7E6FF', '#FFC7B5', '#e6fffa', '#ffe5ec', '#00C851'];
  selectedSessionId: number | undefined;
  sessions: Session[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  constructor(private route: ActivatedRoute, 
              private interviewService: InterviewService,
              private criteriaService: CriteriaService,
              private sessionService: SessionService) { this.interviewData = new MatTableDataSource<any>()}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.interviewId = +params['id']; 
      this.fetchCandidateInterviewData();
    });
    this.getEvaluationCriteria();
    this.getSessions(); 
  }
  ngAfterViewInit() {
    if (this.paginator) {
      this.interviewData.paginator = this.paginator;
    }
  }


getEvaluationCriteria(): void {
  this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
    this.evaluationCriteria = criterias || []; // Ensure evaluationCriteria is initialized
    this.columnsToDisplay = ['User', ...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[]];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  });
}

getSessions(): void {
  this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
    this.sessions = [{ id: undefined, name: 'All' }, ...sessions];
  });
}

filterBySession(sessionId: number): void {
  this.selectedSessionId = sessionId;
  this.fetchCandidateInterviewData();
}

fetchCandidateInterviewData(filters: InterviewFilters = {}): void {
  const page = 1;
  const limit = 50;
  if (this.selectedSessionId !== undefined) {
    filters['sessionId'] = this.selectedSessionId;
  }
  this.interviewService.getAllCandidateInterviewData(page,limit,filters).subscribe(
    (data: Interview[]) => {
      this.interviewData = data;
      this.loading = false;
      console.log('Interview Data:', this.interviewData);
    },
    (error: any) => {
      console.error('Error fetching candidate interview data:', error);
      this.loading = false;
    }
  );
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  if (filterValue) {
    this.fetchCandidateInterviewData({ searchQuery: filterValue });
  } else {
    this.fetchCandidateInterviewData();
  }
}




}
