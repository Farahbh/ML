import { Routes } from '@angular/router';

// ui
import { CompanyComponent } from './company/company.component';
import { UserComponent } from './user/user.component';
import { DefenseComponent } from './defense/defense.component';
import { TaskComponent } from './task/task.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { InternshipComponent } from './internship/internship.component';
import { EventComponent } from './event/event.component';
import { DocumetsComponent } from './documets/documets.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { AuthguardService } from 'src/app/services/authguard.service';
import { ProfilComponent } from './user/profil/profil.component';
import { ClassifierComponent } from '../client/components/classifier/classifier.component';
import { PowerbiComponent } from '../client/components/powerbi/powerbi.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'defense',
        component: DefenseComponent,
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'task',
        component: TaskComponent,
      },
      {
        path: 'complaint',
        component: ComplaintComponent,
      },
      {
        path: 'internship',
        component: InternshipComponent,
      },
      {
        path: 'event',
        component: EventComponent,
      },
      {
        path: 'emploie',
        component: ClassifierComponent,
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate:[AuthguardService], data:{roles:['ADMIN']}
      },
      {
        path: 'interview',
        component: InternshipComponent,
      },
      {
        path: 'documents',
        component: DocumetsComponent,
      },
      {
      path: 'add-task',
      component: AddTaskComponent,

      },
      {
      path: 'add-user',
      component: AddUserComponent,
      canActivate:[AuthguardService], data:{roles:['ADMIN']}
      },
      {
        path: 'profil',
        component: ProfilComponent,
        },
      {
        path: 'power',
        component: PowerbiComponent,
        },
      
      {
      path: 'Update-user',
      component: UpdateUserComponent,
      canActivate:[AuthguardService], data:{roles:['ADMIN']}
      },


    ],
  },
];
