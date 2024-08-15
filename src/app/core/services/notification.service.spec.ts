import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationService, NotificationFilters } from './notification.service';
import { Notification } from '../models/notification.model';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NotificationService]
    });

    service = TestBed.inject(NotificationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch notifications', () => {
    const dummyNotifications: Notification[] = [
      { id: 1, content: 'notification 1' },
      { id: 2, content: 'notification 2' }
    ];

    const page = 1;
    const limit = 10;
    const filters: NotificationFilters = { content: 'test', isActive: true };

    service.getNotifications(page, limit, filters).subscribe((notifications: Notification[]) => {
      expect(notifications.length).toBe(2);
      expect(notifications).toEqual(dummyNotifications);
    });

    const req = httpTestingController.expectOne(req => {
      return (
        req.url === 'notifications' &&
        req.method === 'GET' &&
        req.params.get('page') === '1' &&
        req.params.get('limit') === '10' &&
        req.params.get('content') === 'test' &&
        req.params.get('isActive') === 'true'
      );
    });

    req.flush(dummyNotifications);
  });
});
