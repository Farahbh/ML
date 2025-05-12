import { ComplaintComponent } from './../ui-components/complaint/complaint.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ClientRoutingModule } from './client-routing.module';
import { MainComponent } from './main/main.component';
import { VideoComponent } from './video/video.component';
// import { FooterComponent } from './footer/footer.component';
import { CompanyfrontComponent } from './components/companyfront/companyfront.component';
import { ComplaintfrontComponent } from './components/complaintfront/complaintfront.component';
import { EventfrontComponent } from './components/eventfront/eventfront.component';
import { FooterComponent } from './footer/footer.component';
import { CardTeamComponent } from './components/card-team/card-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PowerbiComponent } from './components/powerbi/powerbi.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AdminComponent } from './components/admin/admin.component';
import { ClassifierComponent } from './components/classifier/classifier.component';
import { NlpComponent } from './components/nlp/nlp.component';
import { JobRecomandationComponent } from './components/job-recomandation/job-recomandation.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MainComponent,
    VideoComponent,
    ComplaintfrontComponent,
    EventfrontComponent,
    FooterComponent,
    CardTeamComponent,
    PowerbiComponent,
    ContactusComponent,
    AdminComponent,
    ClassifierComponent,
    NlpComponent,
    JobRecomandationComponent,
    ChatComponent
  ],
  imports: [CommonModule, ClientRoutingModule,FormsModule,    CompanyfrontComponent,FormsModule,ReactiveFormsModule
  ],
})
export class ClientModule {}
