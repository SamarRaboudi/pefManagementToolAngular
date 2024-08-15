import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Campaign } from '../models/campaign.model';

export interface CampaignFilters {
  [key: string]: any;
  name?: string;
  searchId?: number;
  isActive?: boolean;
  searchQuery?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  campaignAdded: EventEmitter<Campaign> = new EventEmitter<Campaign>();
  constructor(private http: HttpClient) { }

  getCampaigns(page: number, limit: number, filters:CampaignFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('campaign', { params });
  }

  createCampaign(campaign: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>('campaign', campaign)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateCampaign(id: number, campaign: Campaign): Observable<Campaign> {
    return this.http.patch<Campaign>(`campaign/${id}`, campaign)
      .pipe(
        catchError(this.handleError)
      );
  }
  getCampaignById(id: number): Observable<Campaign> {
    return this.http.get<Campaign>(`campaign/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveCampaignsSize(filters: CampaignFilters): Observable<number> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get<number>('campaign/size', { params });
  }

 
  getEvaluatorTeams(evaluatorId: number): Observable<any> {
    return this.http.get<any>(`campaign/evaluator-teams/${evaluatorId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEvaluationScoresAndGrades(requestData: any): Observable<any> {
    return this.http.post<any>('campaign/update-evaluation-scores-and-grades', requestData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTeamEvaluationData(campaignId: number, teamId: number, evaluatorId: number): Observable<any> {
    const url = `campaign/team-evaluation/${campaignId}/${teamId}/${evaluatorId}`;
    return this.http.get<any>(url);
  }

  getTeamAllEvaluationData(teamId: number): Observable<any> {
    const url = `campaign/team-evaluation/${teamId}`;
    return this.http.get<any>(url);
  }

  getCandidatesLeaderBoard(): Observable<any> {
    return this.http.get<any>('campaign/leaderboard/candidates')
      .pipe(
        catchError(this.handleError)
      );
  }

  getCandidateAllEvaluationData(candidateId: number): Observable<any> {
    const url = `campaign/candidate-evaluation/${candidateId}`;
    return this.http.get<any>(url);
  }

  getEvaluationsHistory(evaluatorId: number): Observable<any> {
    const url = `campaign/evaluation-history/${evaluatorId}`;
    return this.http.get<any>(url);
  }

  getSupervisorTeamsData(supervisorId: number): Observable<any> {
    const url = `campaign/supervisor-teams-data/${supervisorId}`;
    return this.http.get<any>(url);
  }

  getAdviceData(campaignId: number, candidateId: number): Observable<any> {
    const url = `campaign/sendAdvice/${campaignId}/${candidateId}`;
    return this.http.get<any>(url);
  }

  generateAdvice(criteria: any, notes: string[]): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      criterias: criteria,
      notes: notes
    };
    
    return this.http.post('http://127.0.0.1:5000/generate-advice', body, { headers: headers });
  }

  sendAdviceResults(results: any):  Observable<any> {
    return this.http.post<any>('campaign/receive-advice-results', results)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }


}
