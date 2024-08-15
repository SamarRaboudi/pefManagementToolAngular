import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Session } from '../models/session.model';

export interface SessionFilters {
  [key: string]: any;
  name?: string;
  id?: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessionAdded: EventEmitter<Session> = new EventEmitter<Session>();

  constructor(private http: HttpClient) { }

  getSessions(page: number, limit: number, filters: SessionFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('session', { params });
  }

  addSession(session: Session): Observable<Session> {
    return this.http.post<Session>('session', session)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`session/${id}`, session)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
