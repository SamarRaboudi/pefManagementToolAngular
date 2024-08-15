import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { User } from 'src/app/core/models/user.model';
import { NotificationFilters, NotificationService } from '../../../core/services/notification.service';
import { Notification } from 'src/app/core/models/notification.model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  title: string = '';
  loading = true;
  userEmail: string;
  user: User;
  notifications: Notification[] = [];
  displayedNotifications = 4;
  unseenNotificationsCount = 0;

  selectedItem: any;
  handleClick($event: any) {
    $event.stopPropagation();
  }

  select(item: any) {
    this.selectedItem = item;
  }

  constructor(public dialog: MatDialog, 
              private router: Router, 
              private activatedRoute: ActivatedRoute, 
              private authService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
    ).subscribe((data) => {
      // Check if the data contains a title
      if (data && data['title']) {
        this.title = data['title'];
      }
    });
  }
  ngOnInit(): void {
    this.fetchUserData();
    this.notificationService.bindNotificationEvent('new_notification', (data: any) => {
      if(data.notificationRceiver == this.user.id){
        this.notifications.unshift(data.notificationRceiver);
        this.unseenNotificationsCount++;
        this.fetchNotifications(data.notificationRceiver);
      }
      
    });
  }

  ngOnDestroy(): void {
    this.notificationService.unbindNotificationEvent('new_notification', (data: any) => {
      this.notifications.unshift(data.notification);
    });
  }


  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('authentication/login');
  }
  viewAccount(){
    this.router.navigateByUrl('dashboard/admin/account');
  }

  fetchUserData(): void {
    this.loading = true;
    this.userEmail = localStorage.getItem('loggedInUserEmail') || '';
    const page = 1;
    const limit = 1;
    this.userService.getUsers(page, limit, { searchQuery: this.userEmail }).subscribe(
      (userAarray: User[]) => {
        this.user = userAarray[0];
        if(this.user.id){
          this.fetchNotifications(this.user.id)
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching User data:', error);
        this.loading = false;
      }
    );
  }

  fetchNotifications(userId: number): void {
    const page = 1;
    const limit = 100;
    this.notificationService.getNotifications(page, limit, { userId: userId }).subscribe(
      (notificationArray: Notification[]) => {
        // Get base URL from environment
        const baseUrl = environment.pictureApiUrl;
        // Concatenate base URL with picture paths
        this.notifications = notificationArray.map(notification => {
          if (notification.content.candidate.picture) {
            if (!notification.content.candidate.picture.startsWith('http')) {
              notification.content.candidate.picture = baseUrl + '/' + notification.content.candidate.picture;
            }
          }
          return notification;
        }).reverse();
        this.unseenNotificationsCount = this.notifications.filter(notification => !notification.isSeen).length;
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }
  showAllNotifications(): void {
    this.displayedNotifications = this.notifications.length;
  }
  getRelativeTime(sendingDate: string): string {
    const now = new Date();
    const sent = new Date(sendingDate);
    const diffInMs = now.getTime() - sent.getTime();
  
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = now.getMonth() - sent.getMonth() + (12 * (now.getFullYear() - sent.getFullYear()));
    const diffInYears = now.getFullYear() - sent.getFullYear();
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    } else {
      return `${diffInYears}y`;
    }
  }

  navigateToEvaluation( isMyTeam: number, campaignId:number, teamId: number): void {
    this.router.navigate(['dashboard/admin/evaluation',isMyTeam,campaignId, teamId]);
  }

  updateUnseenNotificationsToSeen(): void {
    if (this.user) {
      const userId = this.user.id;
      const filters: NotificationFilters = { userId: userId, isSeen: false };
  
      this.notificationService.getNotifications(1, 100, filters).subscribe(
        (notifications: Notification[]) => {
          if (notifications.length > 0) {
            notifications.forEach((notification: Notification) => {
              notification.isSeen = true;
              if (notification.id) {
                this.notificationService.updateNotification(notification.id, notification).subscribe(
                  () => {
                    this.unseenNotificationsCount = 0;
                  },
                  (error) => {
                    console.error('Error updating notification:', error);
                  }
                );
              } else {
                console.error('Notification ID is not defined');
              }
            });
          }
        },
        (error) => {
          console.error('Error fetching unseen notifications:', error);
        }
      );
    } else {
      console.error('User is not defined');
    }
  }
  markNotificationAsClicked(notification: Notification): void {
    notification.isclicked = true;
    if (notification.id) {
      this.notificationService.updateNotification(notification.id, notification).subscribe(
        () => {
        },
        (error) => {
          console.error('Error updating notification:', error);
        }
      );
    } else {
      console.error('Notification ID is not defined');
    }
  }

  deleteNotification(notification: Notification): void {
    notification.isActive = false;
    if (notification.id) {
      this.notificationService.updateNotification(notification.id, notification).subscribe(
        () => {
          this.notifications = this.notifications.filter((n) => n.id !== notification.id);
        },
        (error) => {
          console.error('Error updating notification:', error);
        }
      );
    } else {
      console.error('Notification ID is not defined');
    }
  }
  

}
