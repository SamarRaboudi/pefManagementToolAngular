import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, UserFilters } from './user.service';
import { User } from '../models/user.model';
import { Profil } from '../models/profil.model';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const dummyUsers: User[] = [{ id: 1, email: 'user1@example.com' }, { id: 2, email: 'user2@example.com' }];

    const page = 1;
    const limit = 10;
    const filters: UserFilters = { email: 'test@example.com', isActive: true };

    service.getUsers(page, limit, filters).subscribe((users: User[]) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpTestingController.expectOne('users/?page=1&limit=10&email=test@example.com&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummyUsers);
  });

  it('should add a user', () => {
    const newUser: User = { id: 3, email: 'newuser@example.com' };

    service.addUser(newUser).subscribe((user: User) => {
      expect(user).toEqual(newUser);
    });

    const req = httpTestingController.expectOne('users/');
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should update a user', () => {
    const updatedUser: User = { id: 2, email: 'updateduser@example.com' };

    service.updateUser(2, updatedUser).subscribe((user: User) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpTestingController.expectOne('users/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedUser);
  });

});
