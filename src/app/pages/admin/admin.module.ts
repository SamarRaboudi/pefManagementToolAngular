import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core'; // Import MatOptionModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './users/user/user.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TechnologyComponent } from './technologies/technology/technology.component';
import { MatMenuModule } from '@angular/material/menu';
import { AddTechnologyComponent } from './technologies/add-technology/add-technology.component';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { EditTechnologyComponent } from './technologies/edit-technology/edit-technology.component';
import { DeleteTechnologyComponent } from './technologies/delete-technology/delete-technology.component';
import { ProfilComponent } from './profils/profil/profil.component';
import { AddProfilComponent } from './profils/add-profil/add-profil.component';
import { EditProfilComponent } from './profils/edit-profil/edit-profil.component';
import { DeleteProfilComponent } from './profils/delete-profil/delete-profil.component';
import { SessionComponent } from './sessions/session/session.component';
import { AddSessionComponent } from './sessions/add-session/add-session.component';
import { EditSessionComponent } from './sessions/edit-session/edit-session.component';
import { DeleteSessionComponent } from './sessions/delete-session/delete-session.component';
import { CandidateComponent } from './candidates/candidate/candidate.component';
import { AddCandidateComponent } from './candidates/add-candidate/add-candidate.component';
import { EditCandidateComponent } from './candidates/edit-candidate/edit-candidate.component';
import { DeleteCandidateComponent } from './candidates/delete-candidate/delete-candidate.component';
import { ViewCandidateComponent } from './candidates/view-candidate/view-candidate.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { DeleteUserComponent } from './users/delete-user/delete-user.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { ProjectComponent } from './projects/project/project.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { DeleteProjectComponent } from './projects/delete-project/delete-project.component';
import { CriteriaComponent } from './criterias/criteria/criteria.component';
import { AddCriteriaComponent } from './criterias/add-criteria/add-criteria.component';
import { EditCriteriaComponent } from './criterias/edit-criteria/edit-criteria.component';
import { DeleteCriteriaComponent } from './criterias/delete-criteria/delete-criteria.component';
import { ViewProjectComponent } from './projects/view-project/view-project.component';
import { CampaignComponent } from './campaigns/campaign/campaign.component';
import { AddCampaignComponent } from './campaigns/add-campaign/add-campaign.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxTimepickerModule } from 'ngx-timepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ViewCampaignComponent } from './campaigns/view-campaign/view-campaign.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TeamComponent } from './teams/team/team.component';
import { AddTeamComponent } from './teams/add-team/add-team.component';
import { EditTeamComponent } from './teams/edit-team/edit-team.component';
import { DeleteTeamComponent } from './teams/delete-team/delete-team.component';
import { EvaluationTeamComponent } from './campaigns/evaluation-team/evaluation-team.component';
import { DeleteCampaignComponent } from './campaigns/delete-campaign/delete-campaign.component';
import { AccountComponent } from './account/account.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EvaluationCofirmationComponent } from './campaigns/evaluation-cofirmation/evaluation-cofirmation.component';
import { EvaluationValidationComponent } from './campaigns/evaluation-validation/evaluation-validation.component';
import { EvaluationTeamDetailsComponent } from './teams/evaluation-team-details/evaluation-team-details.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartModule } from 'primeng/chart';
import { AddLimitationComponent } from './limitations/add-limitation/add-limitation.component';
import { EditLimitationComponent } from './limitations/edit-limitation/edit-limitation.component';
import { DeleteLimitationComponent } from './limitations/delete-limitation/delete-limitation.component';
import { LimitationComponent } from './limitations/limitation/limitation.component';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


import { InterviewComponent } from './interviews/interview/interview.component';
import { AddInterviewComponent } from './interviews/add-interview/add-interview.component';
import { EditInterviewComponent } from './interviews/edit-interview/edit-interview.component';
import { DeleteInterviewComponent } from './interviews/delete-interview/delete-interview.component';
import { ViewInterviewComponent } from './interviews/view-interview/view-interview.component';
import { EvaluationInterviewComponent } from './interviews/evaluation-interview/evaluation-interview.component';
import { InterviewConfirmationComponent } from './interviews/interview-confirmation/interview-confirmation.component';
import { InterviewValidationComponent } from './interviews/interview-validation/interview-validation.component';
import { ListInterviewComponent } from './interviews/list-interview/list-interview.component';
import { AvailabilityDialogComponent } from './campaigns/availability-dialog/availability-dialog.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TestPageComponent } from './test-page/test-page.component';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    TechnologyComponent,
    AddTechnologyComponent,
    EditTechnologyComponent,
    DeleteTechnologyComponent,
    ProfilComponent,
    AddProfilComponent,
    EditProfilComponent,
    DeleteProfilComponent,
    SessionComponent,
    AddSessionComponent,
    EditSessionComponent,
    DeleteSessionComponent,
    CandidateComponent,
    AddCandidateComponent,
    EditCandidateComponent,
    DeleteCandidateComponent,
    ViewCandidateComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    ViewUserComponent,
    ProjectComponent,
    AddProjectComponent,
    EditProjectComponent,
    DeleteProjectComponent,
    CriteriaComponent,
    AddCriteriaComponent,
    EditCriteriaComponent,
    DeleteCriteriaComponent,
    ViewProjectComponent,
    CampaignComponent,
    AddCampaignComponent,
    ViewCampaignComponent,
    TeamComponent,
    AddTeamComponent,
    EditTeamComponent,
    DeleteTeamComponent,
    EvaluationTeamComponent,
    DeleteCampaignComponent,
    AccountComponent,
    EvaluationCofirmationComponent,
    EvaluationValidationComponent,
    EvaluationTeamDetailsComponent,
    StatisticsComponent,
    AddLimitationComponent,
    EditLimitationComponent,
    DeleteLimitationComponent,
    LimitationComponent,
    InterviewComponent,
    AddInterviewComponent,
    EditInterviewComponent,
    DeleteInterviewComponent,
    ViewInterviewComponent,
    EvaluationInterviewComponent,
    InterviewConfirmationComponent,
    InterviewValidationComponent,
    ListInterviewComponent,
    AvailabilityDialogComponent,
    TestPageComponent,
  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule, 
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    NgApexchartsModule,
    MatPaginatorModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    NgxTimepickerModule,
    NgxMaterialTimepickerModule,
    MatExpansionModule,
    MatTabsModule, 
    ChartModule,
    EditorModule,
    ToastModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),

    
  ],
  providers: [
    MessageService,
 
  ]
})
export class AdminModule { }
