import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from 'src/app/core/services/nav.service';
import { AuthorizationService } from 'src/app/core/services/authorization.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  navItems = navItems;
  adminExclusiveItems: string[] = ['Campaigns', 'Collaborators', 'Eliminations', 'Evaluation Criteria', 'Profiles', 'Sessions', 'Technologies'];

  constructor(public navService: NavService, private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    if (!this.authorizationService.hasAccess(['Admin'])) {
      this.navItems = this.navItems.filter(item => {
        if (item.displayName) {
          return !this.adminExclusiveItems.includes(item.displayName);
        }
        return true; 
      });
    }
  }
}
