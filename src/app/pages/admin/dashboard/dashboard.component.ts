import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';

import { CampaignService } from '../../../core/services/campaign.service';
import { CandidateService } from '../../../core/services/candidate.service';
import { ProjectFilters, ProjectService } from '../../../core/services/project.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { UserFilters, UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { Session } from '../../../core/models/session.model';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('countTo', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  panelOpenState = false;
  evaluatorTeams: any[] = [];
  teams: any[] = [];
  user: User;
  myTeams: any[] = [];
  userEmail: string;
  campaignSize: number = 0;
  candidatesSize: number = 0;
  projectsSize: number = 0;
  usersSize: number = 0;
  campaignId: number;
  isUserAdmin: boolean = false;
  isUserEvaluator: boolean = false;
  isUserSupervisor: boolean = false;
  leaderboardData: any;
  selectedSession: any;
  sessions: Session[] = [];
  selectedSessionName: string = '';
  podiumItems: any[] = [];
  colors: string[] = ['#BBD0FF', '#FFC7B5', '#B7E6FF', '#FFE3B4', '#e6fffa', '#ffe5ec', '#90EE90', '#eedc82','#9DA09E'];
  projects: Project[] = [];
  candidatesNumberchartData: any;
  candidatesNumberchartOptions: any  ={
    aspectRatio: 2, 
    maintainAspectRatio: true, 
  };
  averageScoreChartData: any; 
  averageScoreChartOptions: any = { 
  aspectRatio: 2,
  maintainAspectRatio: true,
  };
  technologyCountChartData: any;
  technologyCountChartOptions: any  ={
    aspectRatio: 2, 
    maintainAspectRatio: true, 
  };
  teamsChartData: any[] = [];
  teamsChartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true, // Start scale from 0
          stepSize: 1 // Set the difference between ticks to 1
        }
      }]
    }
  };
  isLoadingTopCandidates = false;
  isLoadingCandidatesNumberChart = false;
  isLoadingTechnologyCountChart = false;
  isLoadingAverageScoreChart = false;
  isLoadingTeamsCharts = false;
  userId: number;
  teamsData: any[] = [];
  classifiedCandidates: any[] = [];
  
  constructor(
              private campaignService: CampaignService,
              private candidateService: CandidateService,
              private projectService: ProjectService,
              private userService: UserService,
              private authorizationService: AuthorizationService,
              private router: Router
  ) { this.isUserAdmin = this.authorizationService.hasAccess(['Admin']);
      this.isUserEvaluator = this.authorizationService.hasAccess(['Evaluator']);
      this.isUserSupervisor = this.authorizationService.hasAccess(['Supervisor']);
  }

  ngOnInit(): void {
    this.getCampaignTotalSize();
    this.getCandidatesTotalSize();
    this.getProjectsTotalSize();
    this.getUsersTotalSize();
    this.fetchUser();
    this.fetchLeaderboardData();
    this.getProjects();
    this.getSupervisorTeamsData();
  }

  fetchUser(): void {
    this.userEmail = localStorage.getItem('loggedInUserEmail') || '';
    const filters: UserFilters = {
      searchQuery:  this.userEmail
    };

    // Call the user service to get the user
    this.userService.getUsers(1, 1, filters).subscribe(
      (data: any) => {
        this.user = data[0]; 
        if(this.user && this.user.id)
          {
            this.fetchEvaluatorTeams(this.user.id);
          }
       //   this.loading = false; 
       
      },
      error => {
        console.error('Error fetching user:', error);
       // this.loading = false; 
      }
    );
  }

  teamsPanelOpened(index: number): void {
    this.teams[index].panelOpen = true;
  }

  // Method called when the panel is closed
  teamsPanelClosed(index: number): void {
    this.teams[index].panelOpen = false;
  }

  myTeamsPanelOpened(index: number): void {
    this.myTeams[index].panelOpen = true;
  }

  // Method called when the panel is closed
  myTeamsPanelClosed(index: number): void {
    this.myTeams[index].panelOpen = false;
  }
 


getCampaignTotalSize() {
  this.campaignService.getActiveCampaignsSize({ isActive: true }).subscribe(
    (size: number) => {
      this.campaignSize = size;
    },
    error => {
      console.error('Error while fetching campaigns size:', error);
    }
  );
}

getCandidatesTotalSize() {
  this.candidateService.getActiveCandidatesSize({ isActive: true }).subscribe(
    (size: number) => {
      this.candidatesSize = size;
    },
    error => {
      console.error('Error while fetching candidates size:', error);
    }
  );
}

getProjectsTotalSize() {
  this.projectService.getActiveProjectsSize({ isActive: true }).subscribe(
    (size: number) => {
      this.projectsSize = size;
    },
    error => {
      console.error('Error while fetching projects size:', error);
    }
  );
}

getUsersTotalSize() {
  this.userService.getActiveUsersSize({ isActive: true }).subscribe(
    (size: number) => {
      this.usersSize = size;
    },
    error => {
      console.error('Error while fetching collaborators size:', error);
    }
  );
}



fetchEvaluatorTeams(userId: number): void {
  this.campaignService.getEvaluatorTeams(userId).subscribe(
    (data: any) => {
      this.evaluatorTeams = data; 
      this.teams = this.evaluatorTeams[0].teams;
      this.myTeams = this.evaluatorTeams[0].myteams;
      this.campaignId= this.evaluatorTeams[0].campaignId;
    },
    error => {
      console.error('Error fetching evaluator teams:', error);
    }
  );
}

navigateToEvaluation( isMyTeam: number, teamId: number): void {
  this.router.navigate(['dashboard/admin/evaluation',isMyTeam,this.campaignId, teamId]);
}

fetchLeaderboardData(): void {
  this.campaignService.getCandidatesLeaderBoard().subscribe(
    (data: any) => {
      this.leaderboardData = data;
      if (this.leaderboardData.length > 0) {
        const lastSession = this.leaderboardData[this.leaderboardData.length - 1];
        this.selectSession(lastSession);}
      
      // Generate chart data based on fetched leaderboard data
      this.generateChartData();
    },
    (error: any) => {
      console.error('Error fetching leaderboard data:', error);
    }
  );
}

getSupervisorTeamsData(): void {
  const userIdFromStorage = localStorage.getItem('idUser');

  if (userIdFromStorage !== null) {
    this.userId = +userIdFromStorage;
  } else {
    console.error('User ID not found in localStorage');
    return; // Stop execution if user ID is not found
  }

  this.campaignService.getSupervisorTeamsData(this.userId).subscribe(
    (data: any[]) => {
      this.teamsData = data.slice(-5);
  
      if (this.teamsData.length > 0) {
        const lastTeamsSession = this.teamsData[this.teamsData.length - 1];
        this.selectTeamsSession(lastTeamsSession[0]);
        this.classifyCandidates(lastTeamsSession[0]);
      }
      this.isLoadingTeamsCharts = true;
    },
    (error: any) => {
      console.error('Error fetching supervisors teams data:', error);
      this.isLoadingTeamsCharts = true;
    }
  );
}

classifyCandidates(session: any): any[] {

  if (session && session.teams) {
    session.teams.forEach((team: any) => {
      team.candidates.forEach((candidate: any) => {
        let totalScore = 0;
        let validEvaluations = 0;

        // Calculate total score and count valid evaluations
        candidate.evaluations.forEach((evaluation: any) => {
          if (evaluation.score !== null) {
            totalScore += evaluation.score;
            validEvaluations++;
          }
        });

        // Calculate average score
        const averageScore = validEvaluations > 0 ? totalScore / validEvaluations : 0;
        candidate.averageScore = averageScore;

        // Classify candidates based on average score
        if (averageScore >= 4.5) {
          candidate.classification = "Excellent";
        } else if (averageScore >= 3.5) {
          candidate.classification = "Good";
        } else {
          candidate.classification = "Needs Improvement";
        }

        // Push classified candidate data to the array
        this.classifiedCandidates.push({
          teamName: team.teamName,
          candidate: candidate
        });
      });
    });
  } else {
    console.error("No session or teams found.");
  }

  // Sort classified candidates by average score in descending order
  this.classifiedCandidates.sort((a, b) => b.candidate.averageScore - a.candidate.averageScore);

  return this.classifiedCandidates;
}




processChartData(session: any): void {
  this.teamsChartData = [];

  if (session && session.teams) {
    session.teams.forEach((team: any) => {
      const chartData = this.generateTeamChartData(team);
      // Add team name to chart data
      chartData.teamName = team.teamName; // Assuming the team name is stored in the 'name' property
      // Push chartData to teamsChartData array
      this.teamsChartData.push(chartData);
    });
  } else {
    console.error("No session or teams found.");
  }
}


generateTeamChartData(team: any): any {
  const chartLabels: string[] = [];
  const campaignNames: string[] = [];
  const candidateScores: { [key: string]: number[] } = {};

  // Extract candidate names and initialize score arrays
  team.candidates.forEach((candidate: any) => {
    const candidateName = `${candidate.firstName} ${candidate.lastName}`;
    chartLabels.push(candidateName);
    candidateScores[candidateName] = [];
    
    // Extract campaign names and scores for each candidate
    candidate.evaluations.forEach((evaluation: any) => {
      campaignNames.push(evaluation.campaignName);
      candidateScores[candidateName].push(evaluation.score);
    });
  });

  // Remove duplicate campaign names
  const uniqueCampaignNames = Array.from(new Set(campaignNames));

  // Prepare dataset for each candidate
  const datasets: { [key: string]: any }[] = [];

  Object.keys(candidateScores).forEach((candidateName: string) => {
    datasets.push({
      label: candidateName,
      data: candidateScores[candidateName],
      fill: false,
      borderColor: this.getRandomColor(),
      borderWidth: 3
    });
  });

  // Chart.js options
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true, // Start scale from 0
          stepSize: 1 // Set the difference between ticks to 1
        }
      }]
    }
  };

  // Return chart data object including options
  const chartData = {
    labels: uniqueCampaignNames,
    datasets: datasets,
    options: options
  };


  return chartData;
}



getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const channel = Math.floor(Math.random() * 128) + 128; 
    color += channel.toString(16).padStart(2, "0"); 
  }
  return color;
}



generateChartData(): void {
  if (this.leaderboardData && this.leaderboardData.length > 0) {
    this.generateCandidateCountChartData();
    this.generateAverageScoreChartData();
    this.generateTechnologyCountChartData();
    this.isLoadingTopCandidates = true;
    this.isLoadingCandidatesNumberChart = true;
    this.isLoadingTechnologyCountChart = true;
    this.isLoadingAverageScoreChart = true;
   
  }
}

generateCandidateCountChartData(): void {
  const sessionLabels: string[] = [];
  const candidateCounts: number[] = [];
  const backgroundColors: string[] = [];
  const lastSessions = this.leaderboardData.slice(-5);
  lastSessions.forEach((session: any, index: number) => {
    sessionLabels.push(session.sessionName);
    const firstCampaign = session.campaigns[0];
    const candidateCount = firstCampaign ? firstCampaign.leaderboard.length : 0;
    candidateCounts.push(candidateCount);
    backgroundColors.push(this.colors[index % this.colors.length]);
  });

  this.candidatesNumberchartData = {
    labels: sessionLabels,
    datasets: [
      {
        label: 'Candidate Count',
        data: candidateCounts,
        backgroundColor: backgroundColors,
      }
    ]
  };
}

generateAverageScoreChartData(): void {
  const sessionLabels: string[] = [];
  const averageScores: number[] = [];
  const backgroundColors: string[] = [];
  const lastSessions = this.leaderboardData.slice(-5);
  lastSessions.forEach((session: any, index: number) => {
    sessionLabels.push(session.sessionName);
    const campaigns = session.campaigns;
    let totalCampaignScore = 0;
    let totalCampaigns = campaigns.length;

    campaigns.forEach((campaign: any) => {
      let totalScore = 0;
      let candidateCount = campaign.leaderboard.length;

      campaign.leaderboard.forEach((candidate: any) => {
        totalScore += candidate.score;
      });

      const campaignAverageScore = candidateCount > 0 ? totalScore / candidateCount : 0;
      totalCampaignScore += campaignAverageScore;
    });

    const sessionAverageScore = totalCampaigns > 0 ? totalCampaignScore / totalCampaigns : 0;
    averageScores.push(sessionAverageScore);
    backgroundColors.push(this.colors[index % this.colors.length]);
  });

  this.averageScoreChartData = {
    labels: sessionLabels,
    datasets: [
      {
        label: 'Average Score',
        data: averageScores,
        backgroundColor: backgroundColors,
      }
    ]
  };
}


generateTechnologyCountChartData(): void {
  const technologyCounts: Map<string, number> = new Map();

  // Iterate through each project and count the occurrences of each technology
  
  this.projects.forEach((project: any) => {
    project.technologies.forEach((technology: any) => {
      const technologyLabel = technology.label;
      if (technologyCounts.has(technologyLabel)) {
        // Increment count if the key exists
        technologyCounts.set(technologyLabel, technologyCounts.get(technologyLabel)! + 1); // Notice the "!" to assert non-null
      } else {
        // Initialize count if the key doesn't exist
        technologyCounts.set(technologyLabel, 1);
      }
    });
  });

  // Extract data from the map for chart rendering
  const labels: string[] = Array.from(technologyCounts.keys());
  const counts: number[] = Array.from(technologyCounts.values());
  const backgroundColors: string[] = labels.map((_, index) => this.colors[index % this.colors.length]);

  // Create chart data object
  this.technologyCountChartData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors,
      }
    ]
  };
}





selectSession(session: any): void {
  this.selectedSession = session;
  this.selectedSessionName = session.sessionName;
  this.getTopCandidatesInSession(session); 
  this.classifyCandidates(session);
  
}

selectTeamsSession(session:any){
  this.processChartData(session);
}


getProjects(filters: ProjectFilters = {}): void {
  const page = 1;
  const limit = 50;
  this.projectService.getProjects(page, limit, filters)
    .subscribe((data: any) => {
      this.projects= data;
    });
}

getTopCandidatesInSession(session: any): void {
  const topCandidatesPerSession: any[] = [];

  // Calculate top candidates for the selected session
  const campaigns = session.campaigns;

  
  const candidateScores: Map<number, number[]> = new Map(); 
  const candidateCounts: Map<number, number> = new Map(); 

  // Iterate through each campaign
  campaigns.forEach((campaign: any) => {
    campaign.leaderboard.forEach((candidate: any) => {
      const candidateId = candidate.id;
      const score = candidate.score;

      // Update candidate's score array
      if (candidateScores.has(candidateId)) {
        candidateScores.get(candidateId)!.push(score);
      } else {
        candidateScores.set(candidateId, [score]);
      }

      // Update candidate's campaign count
      if (candidateCounts.has(candidateId)) {
        candidateCounts.set(candidateId, candidateCounts.get(candidateId)! + 1);
      } else {
        candidateCounts.set(candidateId, 1);
      }
    });
  });

  // Calculate the average score for each candidate
  const averageCandidateScores: Map<number, number> = new Map();
  candidateScores.forEach((scores: number[], candidateId: number) => {
    const campaignCount = candidateCounts.get(candidateId) || 1; // Ensure at least 1 campaign to avoid division by zero
    const averageScore = scores.reduce((acc, cur) => acc + cur, 0) / campaignCount;
    averageCandidateScores.set(candidateId, averageScore);
  });

  // Sort candidates by average score and select top 3
  const sortedCandidates = Array.from(averageCandidateScores.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Retrieve full details of top candidates
  const topCandidates: any[] = [];
  sortedCandidates.forEach(([candidateId, averageScore]) => {
    const candidate = campaigns.flatMap((campaign: any) => campaign.leaderboard).find((candidate: any) => candidate.id === candidateId);
    if (candidate) {
      topCandidates.push({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        picture: candidate.picture,
        score: averageScore,
        team: candidate.team,
        project: candidate.project
      });
    }
  });

  // Store top candidates for the session
  topCandidatesPerSession.push({ sessionName: session.sessionName, topCandidates });
  this.podiumItems = topCandidatesPerSession[0]?.topCandidates || [];

}








}
