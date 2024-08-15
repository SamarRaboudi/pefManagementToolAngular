import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Interview } from '../models/interview.model';

export interface InterviewFilters {
  [key: string]: any;
  searchId?:number;
     name?:string;
     isActive?:boolean ;
     searchQuery?: string;
     userId?: number;
}


@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  interviewAdded: EventEmitter<Interview> = new EventEmitter<Interview>();

  constructor(private http: HttpClient) { }

  getInterviews(page: number, limit: number, filters:InterviewFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit))
      .set('sessionId', filters['sessionId'] ? filters['sessionId'].toString() : '');

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('interview', { params });
  }

  addInterview(interview: Interview): Observable<Interview> {
    return this.http.post<Interview>('interview', interview)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateInterview(id: number, interview: Interview): Observable<Interview> {
    return this.http.patch<Interview>(`interview/${id}`, interview)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCandidateInterviewData(interviewId: number): Observable<any> {
    const url = `interview/candidate-interview/${interviewId}`;
    return this.http.get<any>(url);
  }
  
  getAllCandidateInterviewData(page: number, limit: number, filters:InterviewFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
  
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('interview/candidate-interviews', { params });
  }
  
  
  getInterviewData(interviewId: number,userId: number ): Observable<any> {
    const url = `interview/interview-data/${interviewId}/${userId}`;
    return this.http.get<any>(url);
  }
  updateInterviewScoresAndGrades(requestData: any): Observable<any> {
    return this.http.post<any>('interview/update-interview-scores-and-grades', requestData)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  
}
