import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { VideoComponent } from './video/video.component';
import { ComplaintfrontComponent } from './components/complaintfront/complaintfront.component';
import { CompanyfrontComponent } from './components/companyfront/companyfront.component';
import { EventfrontComponent } from './components/eventfront/eventfront.component';
import { PowerbiComponent } from './components/powerbi/powerbi.component';
import { AdminComponent } from './components/admin/admin.component';
import { AppSideLoginComponent } from '../authentication/login/login.component';
import { ClassifierComponent } from './components/classifier/classifier.component';
import { JobRecomandationComponent } from './components/job-recomandation/job-recomandation.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from '../guards/AuthGuard';
import { NlpComponent } from './components/nlp/nlp.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: VideoComponent },
      { path: 'complaint', component: ComplaintfrontComponent },
      { path: 'company', component: CompanyfrontComponent },
      { path: 'events', component: EventfrontComponent },
      {path:'power',component:PowerbiComponent},
      {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }, // Seuls les admins peuvent accéder
      },
      {path:'emploie', component: ClassifierComponent },
      {path:'jobs',component:JobRecomandationComponent},
      {path:'chat',component:ChatComponent},
      {path:'nlp',component:NlpComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
