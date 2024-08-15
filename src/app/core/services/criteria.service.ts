import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Criteria } from '../models/criteria.model';
import { Profil } from '../models/profil.model';

export interface CriteriaFilters {
  [key: string]: any;
    id?:number;
    name?:string;
    value?:number;
    isActive?:boolean ;
    profil?: Profil;
}


@Injectable({
  providedIn: 'root'
})
export class CriteriaService {
  criteriaAdded: EventEmitter<Criteria> = new EventEmitter<Criteria>();

  constructor(private http: HttpClient) { }

  getCriterias(page: number, limit: number, filters:CriteriaFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('criterias', { params });
  }

  addCriteria(criteria: Criteria): Observable<Criteria> {
    return this.http.post<Criteria>('criterias', criteria)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateCriteria(id: number, criteria: Criteria): Observable<Criteria> {
    return this.http.patch<Criteria>(`criterias/${id}`, criteria)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

  
}
