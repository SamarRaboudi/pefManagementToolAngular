import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private authorizationService: AuthorizationService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Check the route path to determine the required profiles
    const path = route.routeConfig?.path;
    let requiredProfiles: string[] = [];

    // Set required profiles based on the route path
    switch (path) {
      case 'campaigns':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'campaign/:id':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'users':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'users/:id':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'limitations':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'criterias':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'profils':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'technologies':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      case 'sessions':
        // Only allow access for the Admin profile
        requiredProfiles = ['Admin'];
        break;
      default:
        // No specific profiles required for other routes
        break;
    }

    // Check if the user has access based on required profiles
    if (this.authorizationService.hasAccess(requiredProfiles)) {
      return true;
    } else {
      // Redirect to unauthorized page or handle unauthorized access
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
