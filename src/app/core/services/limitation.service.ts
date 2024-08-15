import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Limitation } from '../models/limitation.model';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';

export interface LimitationFilters {
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
export class LimitationService {
  limitationAdded: EventEmitter<Limitation> = new EventEmitter<Limitation>();

  constructor(private http: HttpClient) { }

  getLimitations(page: number, limit: number, filters:LimitationFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('limitation', { params });
  }

  addLimitation(limitation: Limitation): Observable<Limitation> {
    return this.http.post<Limitation>('limitation', limitation)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateLimitation(id: number, limitation: Limitation): Observable<Limitation> {
    return this.http.patch<Limitation>(`limitation/${id}`, limitation)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  
}
