import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as path from 'path';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './users/user/user.component';
import { TechnologyComponent } from './technologies/technology/technology.component';
import { ProfilComponent } from './profils/profil/profil.component';
import { SessionComponent } from './sessions/session/session.component';
import { CandidateComponent } from './candidates/candidate/candidate.component';
import { ViewCandidateComponent } from './candidates/view-candidate/view-candidate.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { ProjectComponent } from './projects/project/project.component';
import { CriteriaComponent } from './criterias/criteria/criteria.component';
import { CampaignComponent } from './campaigns/campaign/campaign.component';
import { ViewCampaignComponent } from './campaigns/view-campaign/view-campaign.component';
import { TeamComponent } from './teams/team/team.component';
import { EvaluationTeamComponent } from './campaigns/evaluation-team/evaluation-team.component';
import { AccountComponent } from './account/account.component';
import { EvaluationTeamDetailsComponent } from './teams/evaluation-team-details/evaluation-team-details.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LimitationComponent } from './limitations/limitation/limitation.component';
import { ProfileGuard } from 'src/app/core/guards/profile.guard';
import { InterviewComponent } from './interviews/interview/interview.component';
import { ViewInterviewComponent } from './interviews/view-interview/view-interview.component';
import { EvaluationInterviewComponent } from './interviews/evaluation-interview/evaluation-interview.component';
import { ListInterviewComponent } from './interviews/list-interview/list-interview.component';
import { TestPageComponent } from './test-page/test-page.component';




const routes: Routes = [
  {
    path:'',
    component: DashboardComponent,
    data: { title: 'Home' }
  },
  {
    path:'users',
    component: UserComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Collaborators' }
  },
  {
    path:'technologies',
    component: TechnologyComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Technologies' }
  },
  {
    path:'profils',
    component: ProfilComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Profiles' }
  },
  {
    path:'sessions',
    component: SessionComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Sessions' }
  },
  {
    path:'candidates',
    component: CandidateComponent,
    data: { title: 'Candidates' }
  },
  {
    path: 'candidates/:id',
    component: ViewCandidateComponent,
    data: { title: 'Candidate Details' }
  },
  {
    path: 'users/:id',
    component: ViewUserComponent,
    canActivate: [ProfileGuard],
    data: { title: 'User Details' }
  },
  {
    path: 'projects',
    component: ProjectComponent,
    data: { title: 'Projects' }
  },
  {
    path: 'criterias',
    component: CriteriaComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Evaluation Criterias' }
  },
  {
    path: 'campaigns',
    component: CampaignComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Campaigns' }
  },
  {
    path: 'campaign/:id',
    component: ViewCampaignComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Campaign Details' }
  },
  {
    path: 'teams',
    component: TeamComponent,
    data: { title: 'Teams' }
  },
  {
    path: 'evaluation/:isMyTeam/:campaignId/:teamId',
    component: EvaluationTeamComponent,
    data: { title: 'Evaluation' }
  },
  {
    path: 'account',
    component: AccountComponent,
    data: { title: 'My Profile' }
  },
  {
    path: 'team/:teamId',
    component: EvaluationTeamDetailsComponent,
    data: { title: 'Team Evaluation Details' }
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    data: { title: 'Statistics' }
  },
  {
    path: 'limitations',
    component: LimitationComponent,
    canActivate: [ProfileGuard],
    data: { title: 'Evaluation Eliminations' }
  },
  {
    path: 'interviews',
    component: InterviewComponent,
    data: { title: 'Interviews' }
  },
  {
    path: 'interviews/:id',
    component: ViewInterviewComponent,
    data: { title: 'Interview Details' }
},
  {
    path: 'interviews/:id/:userId',
    component: EvaluationInterviewComponent,
    data: { title: 'Interview' }
  },
  {
    path: 'interviews-list',
    component: ListInterviewComponent,
    data: { title: 'Interviews List' }
  },
  {
    path: 'test',
    component: TestPageComponent,
    data: { title: 'Interviews list' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
