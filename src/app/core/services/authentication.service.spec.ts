import { of } from 'rxjs';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpClientSpy: any;

  beforeEach(() => {
    httpClientSpy = {
      post: jest.fn()
    }
    service = new AuthenticationService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test onLogin method', () => {
    const obj= {
      email: "test@gmail.com",
      password: "secret"
    }
    const res= {
      email: "test@gmail.com",
      role: "user",
      token: "fakeToken"
    }
    jest.spyOn(httpClientSpy, "post").mockReturnValue(of(res));
    service.onLogin(obj);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    expect(httpClientSpy.post).toHaveBeenCalledWith('login', obj);
  });

  
});
