import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from 'src/app/core/models/notification.model';
import Pusher, { Channel } from 'pusher-js';

export interface NotificationFilters {
  [key: string]: any;
  searchId?: number;
  status?: boolean;
  isActive?: boolean;
  searchQuery?: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pusher: Pusher;
  private channel: Channel;

  constructor(private http: HttpClient) {
    this.pusher = new Pusher(environment.PUSHER_APP_KEY, {
      cluster: environment.PUSHER_APP_CLUSTER,
      forceTLS: true
    });

    this.channel = this.pusher.subscribe('notifications');
  }

  getNotifications(page: number, limit: number, filters: NotificationFilters): Observable<any> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined) {
        params = params.set(key, String(filters[key]));
      }
    });

    return this.http.get('notifications', { params });
  }

  bindNotificationEvent(eventName: string, callback: (data: any) => void): void {
    this.channel.bind(eventName, callback);
  }

  unbindNotificationEvent(eventName: string, callback: (data: any) => void): void {
    this.channel.unbind(eventName, callback);
  }

  updateNotification(id: number, notification: Notification): Observable<Notification> {
    return this.http.patch<Notification>(`notifications/${id}`, notification)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

}
