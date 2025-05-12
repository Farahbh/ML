import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'ESPRIT Internship',
  },
  {
    displayName: 'User Management',
    iconName: 'users',
    route: '/ui-components/user',
  },
  {
    displayName: 'Company Management',
    iconName: 'briefcase',
    route: '/ui-components/company',
  },
  {
    displayName: 'Defense Management',
    iconName: 'gavel',
    route: '/ui-components/defense',
  },
  {
    displayName: 'Task Management',
    iconName: 'checklist',
    route: '/ui-components/task',
  },
  {
    displayName: 'Complaint Management',
    iconName: 'tooltip',
    route: '/ui-components/complaint',
  },
  {
    displayName: 'Internship Management',
    iconName: 'file-description',
    route: '/ui-components/internship',
  },
  {
    displayName: 'Event Management',
    iconName: 'calendar-event',
    route: '/ui-components/event',
  },
  {
    displayName: 'Interview Management',
    iconName: 'video',
    route: '/ui-components/interview',
  },
  {
    displayName: 'Documents Managements',
    iconName: 'file-type-doc',
    route: '/ui-components/documents',
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Login',
    iconName: 'lock',
    route: '/authentication/login',
  },

];
