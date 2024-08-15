import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly EMAIL_KEY = 'loggedInUserEmail';

  constructor(private http: HttpClient) { }

  onLogin(obj:any) : Observable<any>{
    localStorage.setItem(this.EMAIL_KEY, obj.email);
    return this.http.post('login', obj);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.EMAIL_KEY);
  }
}
