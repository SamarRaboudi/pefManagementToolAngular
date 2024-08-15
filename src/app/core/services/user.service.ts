import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Profil } from '../models/profil.model';

export interface UserFilters {
  [key: string]: any;
    id?:number;
    email?:string;
    roles?:[] ;
    prenom?:string ;
     nom?:string;
     isActive?:boolean ;
     searchQuery?: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userAdded: EventEmitter<User> = new EventEmitter<User>();

  constructor(private http: HttpClient) { }

  getUsers(page: number, limit: number, filters:UserFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('users/', { params });
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('users/', user)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.patch<User>(`users/${id}`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  updatePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const body = { currentPassword, newPassword };
    return this.http.patch<any>(`users/${userId}/password`, body);
  }  
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`users/${email}`)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    const body = { token, newPassword };
    return this.http.post<any>('users/reset-password', body);
  }

  uploadUserPicture(id: number, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('picture', file, file.name);
    
    return this.http.post<string>(`users/${id}/picture`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getActiveUsersSize(filters: UserFilters): Observable<number> {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get<number>('users/size', { params });
  }
  
}
