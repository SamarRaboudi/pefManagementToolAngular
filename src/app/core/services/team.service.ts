import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Team } from '../models/team.model';
import { Project } from '../models/project.model';
import { Session } from '../models/session.model';

export interface TeamFilters {
  [key: string]: any;
  searchId?:number;
     name?:string;
     isActive?:boolean ;
     searchQuery?: string;
     projectId?: number;
}


@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamAdded: EventEmitter<Team> = new EventEmitter<Team>();

  constructor(private http: HttpClient) { }

  getTeams(page: number, limit: number, filters:TeamFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('teams', { params });
  }

  addTeam(team: Team): Observable<Team> {
    return this.http.post<Team>('teams', team)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateTeam(id: number, team: Team): Observable<Team> {
    return this.http.patch<Team>(`teams/${id}`, team)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  
}
