import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard/admin',
  },
  {
    displayName: 'Statistics',
    iconName: 'chart-bar',
    route: '/dashboard/admin/statistics',
  },
  {
    navCap: 'Management',
  },
  {
    displayName: 'Campaigns',
    iconName: 'calendar-code',
    route: 'dashboard/admin/campaigns',
  },
  {
    displayName: 'Candidates',
    iconName: 'friends',
    route: 'dashboard/admin/candidates',
  },
  {
    displayName: 'Collaborators',
    iconName: 'users',
    route: 'dashboard/admin/users',
  },
  {
    displayName: 'Eliminations',
    iconName: 'exclamation-mark-off',
    route: 'dashboard/admin/limitations',
  },
  {
    displayName: 'Evaluation Criteria',
    iconName: 'clipboard-list',
    route: 'dashboard/admin/criterias',
  },
  {
    displayName: 'Profiles',
    iconName: 'user-circle',
    route: 'dashboard/admin/profils',
  },
  {
    displayName: 'Projects',
    iconName: 'source-code',
    route: 'dashboard/admin/projects',
  },
  {
    displayName: 'Sessions',
    iconName: 'timeline-event',
    route: 'dashboard/admin/sessions',
  },
  {
    displayName: 'Teams',
    iconName: 'users-group',
    route: 'dashboard/admin/teams',
  },
  {
    displayName: 'Technologies',
    iconName: 'brand-html5',
    route: 'dashboard/admin/technologies',
  },
  {
    displayName: 'Interviews',
    iconName: 'user-exclamation',
    route: 'dashboard/admin/interviews',
   },
   

];
