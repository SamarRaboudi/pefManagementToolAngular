import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Candidate } from '../models/candidate.model';

export interface CandidateFilters {
  [key: string]: any;
  firstName?: string;
  lastName?: string;
  email?: string;
  id?: number;
  isActive?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  candidateAdded: EventEmitter<Candidate> = new EventEmitter<Candidate>();

  constructor(private http: HttpClient) { }

  getCandidates(page: number, limit: number, filters: CandidateFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('candidate', { params });
  }

  getCandidatesWithTeams(page: number, limit: number, filters: CandidateFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('candidate/with-team', { params });
  }

  addCandidate(formData: FormData): Observable<Candidate> {
    return this.http.post<Candidate>('candidate', formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCandidate(id: number, candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`candidate/${id}`, candidate)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadCandidatePicture(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    return this.http.post<string>(`candidate/${id}/picture`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveCandidatesSize(filters: CandidateFilters): Observable<number> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get<number>('candidate/size', { params });
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`candidate/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
