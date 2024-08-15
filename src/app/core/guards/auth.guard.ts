import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check if the route is the reset-password route
    if (state.url.includes('/reset-password')) {
      // Allow access without requiring a token
      return true;
    }
    
    // For other routes, check if there's a token in local storage
    const localToken = localStorage.getItem('token');
    if (localToken) {
      return true; 
    } else {
      // Redirect to the login page if there's no token
      return this.router.createUrlTree(['/authentication/login'], { queryParams: { returnUrl: state.url } });
    }
  }
}
