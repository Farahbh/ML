import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { ResetpassemailComponent } from './resetpassword/resetpassemail/resetpassemail.component';
import { ResetpwdComponent } from './resetpassword/resetpwd/resetpwd.component';
import { AdminComponent } from '../client/components/admin/admin.component';
import { AuthGuard } from '../guards/AuthGuard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'respwdEmail',
        component: ResetpassemailComponent,
      },
      {
        path: 'respwd/:id',
        component: ResetpwdComponent,
      },
      {
         path: 'admin',
         component: AdminComponent,
         canActivate: [AuthGuard],
         data: { roles: ['admin'] }, // Seuls les admins peuvent accéder
           },
    ],
  },
];
