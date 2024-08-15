import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Profil } from '../models/profil.model';

export interface ProfilFilters {
  [key: string]: any;
  titre?: string;
  id?: number;
  isActive?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  profilAdded: EventEmitter<Profil> = new EventEmitter<Profil>();

  constructor(private http: HttpClient) { }

  getProfils(page: number, limit: number, filters:ProfilFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('profils/', { params });
  }
  addProfil(profil: Profil): Observable<Profil> {
    return this.http.post<Profil>('profils/', profil)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateProfil(id: number, profil: Profil): Observable<Profil> {
    return this.http.patch<Profil>(`profils/${id}`, profil)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
