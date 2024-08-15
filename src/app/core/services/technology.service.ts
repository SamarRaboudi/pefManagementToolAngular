import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Technology } from '../models/technology.model';

export interface TechnologyFilters {
  [key: string]: any;
  label?: string;
  id?: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class TechnologyService {
  technologyAdded: EventEmitter<Technology> = new EventEmitter<Technology>();

  constructor(private http: HttpClient) { }
  
  getTechnologies(page: number, limit: number, filters: TechnologyFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('technology', { params });
  }


  addTechnology(formData: FormData): Observable<Technology> {
    return this.http.post<Technology>('technology', formData)
      .pipe(
        catchError(this.handleError)
      );
  }
  


  updateTechnology(id: number, technology: Technology): Observable<Technology> {
    return this.http.put<Technology>(`technology/${id}`, technology)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadTechnologyLogo(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('logo', file, file.name);
    
    return this.http.post<string>(`technology/${id}/logo`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

 

}
