import { Injectable } from '@angular/core';
import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  getUserProfiles(): string[] {
    const profilesString = localStorage.getItem('profiles');
    return profilesString ? JSON.parse(profilesString) : [];
  }

  hasAccess(requiredProfiles: string[]): boolean {
    const userProfiles = this.getUserProfiles();
    
    // Check if the user has at least one required profile
    const hasAccess = requiredProfiles.some(profile => {
      const hasProfile = userProfiles.includes(profile);
      return hasProfile;
    });
    return hasAccess;
  }
  
  
}
