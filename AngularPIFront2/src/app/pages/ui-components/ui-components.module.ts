import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UiComponentsRoutes } from './ui-components.routing';

// ui components
import { MatNativeDateModule } from '@angular/material/core';
import { UserComponent } from './user/user.component';
import { CompanyComponent } from './company/company.component';
import { DefenseComponent } from './defense/defense.component';
import { TaskComponent } from './task/task.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { InternshipComponent } from './internship/internship.component';
import { EventComponent } from './event/event.component';
import { InterviewComponent } from './interview/interview.component';
import { DocumetsComponent } from './documets/documets.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { UpdateTaskComponent } from './task/update-task/update-task.component';
import { AddUserComponent } from './user/add-user/add-user.component';
import { UpdateUserComponent } from './user/update-user/update-user.component';
import { ProfilComponent } from './user/profil/profil.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UiComponentsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatInputModule,ReactiveFormsModule
  ],
  declarations: [
    UserComponent,
    CompanyComponent,
    DefenseComponent,
    TaskComponent,
    ComplaintComponent,
    InternshipComponent,
    EventComponent,
    InterviewComponent,
    DocumetsComponent,
    AddTaskComponent,
    UpdateTaskComponent,
    AddUserComponent,
    UpdateUserComponent,
    ProfilComponent
    
  ],
})
export class UicomponentsModule {}
