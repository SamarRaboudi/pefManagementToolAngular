import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Technology } from '../models/technology.model';
import { Project } from '../models/project.model';
import { User } from '../models/user.model';

export interface ProjectFilters {
  [key: string]: any;
    id?:number;
    title?:string;
    isActive?:boolean ;
    technology?: Technology;
    supervisor?: User;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectAdded: EventEmitter<Project> = new EventEmitter<Project>();
  
  constructor(private http: HttpClient) { }

  getProjects(page: number, limit: number, filters:ProjectFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('project', { params });
  }

  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>('project', project)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`project/${id}`, project)
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveProjectsSize(filters: ProjectFilters): Observable<number> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get<number>('project/size', { params });
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
   
}
