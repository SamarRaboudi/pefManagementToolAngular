import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Session } from '../../../core/models/session.model';
import { CampaignService } from '../../../core/services/campaign.service';
import { NgxPrintElementService, Config } from 'ngx-print-element';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  loading = true;
  leaderboardData: any;
  sessions: Session[] = [];
  selectedSession: any;
  selectedCampaign: any;
  selectedSessionName: string = '';
  selectedCampaignName: string = '';
  candidatesAveargesScoreschartData: any;
  candidatesAveargesScoreschartOptions: any;
  criteriaAveragesChartData: any ;
  criteriaAveragesChartOptions: any;
  criteriaGeneralAveragesChartData: any;
  criteriaGeneralAveragesChartOptions: any = {
    aspectRatio: 2, 
    maintainAspectRatio: true, 
  };
  candidatesScoreComparisonChartData: any;
  candidatesScoreComparisonChartOptions: any = {
    aspectRatio: 2, 
    maintainAspectRatio: true, 
  };
  colors: string[] = ['#BBD0FF', '#FFE3B4', '#B7E6FF', '#FFC7B5', '#e6fffa', '#ffe5ec', '#00C851'];
  showAllCandidates: boolean = false;
  showPrint = false;
  

  constructor(private campaignService: CampaignService, public print: NgxPrintElementService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLeaderboardData();
  }

  fetchLeaderboardData(): void {
    this.campaignService.getCandidatesLeaderBoard()
      .subscribe(
        (data: any) => {
          this.leaderboardData = data;

          // Select the last session and its last campaign by default
          if (this.leaderboardData.length > 0) {
            const lastSession = this.leaderboardData[this.leaderboardData.length - 1];
            this.selectSession(lastSession);

            if (lastSession.campaigns.length > 0) {
              const lastCampaign = lastSession.campaigns[lastSession.campaigns.length - 1];
              this.selectCampaign(lastCampaign);
            }
          }
          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching leaderboard data:', error);
          this.loading = false;
        }
      );
  }

  selectSession(session: any): void {
    this.selectedSession = session;
    this.selectedSessionName = session.sessionName;
    // Generate chart data whenever a session is selected
    this.generateChartData(session);
  }
  
  selectCampaign(campaign: any): void {
    this.selectedCampaign = campaign;
    this.selectedCampaignName = campaign.name;
    // Generate chart data whenever a campaign is selected
    if (this.selectedSession) {
      this.generateChartData(this.selectedSession);
    }
  }
  generateCandidatesAverageScoresChartData(session: any): any {
    const campaignNames: string[] = session.campaigns.map((campaign: any) => campaign.name);
    const averageScores: number[] = session.campaigns.map((campaign: any) => {
      const scores: number[] = campaign.leaderboard.map((candidate: any) => candidate.score);
      const average: number = scores.reduce((total: number, score: number) => total + score, 0) / scores.length;
      return Math.round(average * 100) / 100; // Round to 2 decimal places
    });
  
    return {
      labels: campaignNames,
      datasets: [
        {
          label: 'Average Score',
          data: averageScores,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };
  
  }
  
  generateCriteriaAveragesChartData(session: any, criteriaNames: string[]): any {
    const campaignNames: string[] = session.campaigns.map((campaign: any) => campaign.name);
    const criteriaAveragesData = criteriaNames.map((criteriaName: string, index: number) => ({
        label: criteriaName,
        data: session.campaigns.map((campaign: any) => {
            const campaignCandidates = campaign.leaderboard.length;
            const totalCriteriaGrade = campaign.leaderboard.reduce((total: number, candidate: any) => {
                const criteria = candidate.criteriaAverages.find((criteria: any) => criteria.name === criteriaName);
                return total + (criteria ? criteria.averageGrade : 0);
            }, 0);
            const average: number = campaignCandidates > 0 ? totalCriteriaGrade / campaignCandidates : 0;
            return Math.round(average * 100) / 100; // Round to 2 decimal places
        }),
        fill: false, // Disable fill to show lines only
        borderColor: this.colors[index % this.colors.length], // Use colors from the defined array
        borderWidth: 3,
    }));

    return {
        labels: campaignNames,
        datasets: criteriaAveragesData.length > 0 ? criteriaAveragesData : [{ label: '', data: [] }]
    };
}

  
  generateGeneralCriteriaAveragesChartData(session: any, criteriaNames: string[]): any {
    const generalCriteriaAveragesData = criteriaNames.map((criteriaName: string, index: number) => {
      const totalGrade = session.campaigns.reduce((total: number, campaign: any) => {
        const candidateAverages = campaign.leaderboard.map((candidate: any) => {
          const criteria = candidate.criteriaAverages.find((criteria: any) => criteria.name === criteriaName);
          return criteria ? criteria.averageGrade : 0;
        });
        const campaignAverage = candidateAverages.reduce((campaignTotal: number, candidateAverage: number) => campaignTotal + candidateAverage, 0) / candidateAverages.length;
        return total + campaignAverage;
      }, 0);
      const generalAverage: number = session.campaigns.length > 0 ? totalGrade / session.campaigns.length : 0;
      return Math.round(generalAverage * 100) / 100; // Round to 2 decimal places
    });
  
    return {
      datasets: [
        {
          data: generalCriteriaAveragesData,
          backgroundColor: this.colors, // Use colors from the defined array
          label: 'General Criteria Averages'
        }
      ],
      labels: criteriaNames
    };
  }

  
  
  generateGeneralScoreComparisonChartData(session: any, selectedCampaign: any): any {
    const campaignCandidates = selectedCampaign.leaderboard.length;
    const campaignAverageScore = selectedCampaign.leaderboard.reduce((total: number, candidate: any) => total + candidate.score, 0) / campaignCandidates;
    let greaterThanAverageCount = 0;
    let lessThanAverageCount = 0;
  
    selectedCampaign.leaderboard.forEach((candidate: any) => {
      if (candidate.score >= campaignAverageScore) {
        greaterThanAverageCount++;
      } else if (candidate.score < campaignAverageScore) {
        lessThanAverageCount++;
      }
    });
  
    return {
      datasets: [
        {
          data: [greaterThanAverageCount, lessThanAverageCount],
          backgroundColor: ['#BBD0FF', '#FFC7B5'],
          label: 'General Score Comparison'
        }
      ],
      labels: ['Greater Than Average', 'Less Than Average']
    };
  }
  
  generateChartData(session: any): void {
    this.candidatesAveargesScoreschartData = this.generateCandidatesAverageScoresChartData(session);
    const criteriaNames: string[] = session.campaigns.length > 0 ? session.campaigns[0].leaderboard[0].criteriaAverages.map((criteria: any) => criteria.name) : [];
    this.criteriaAveragesChartData = this.generateCriteriaAveragesChartData(session, criteriaNames);
    this.criteriaGeneralAveragesChartData = this.generateGeneralCriteriaAveragesChartData(session, criteriaNames);
    // Set selectedCampaign to the last campaign of the session if not already selected
    if (!this.selectedCampaign && session.campaigns.length > 0) {
      const lastCampaign = session.campaigns[session.campaigns.length - 1];
      this.selectCampaign(lastCampaign);
    }
  
    // Generate the fourth chart data if a campaign is selected
    if (this.selectedCampaign) {
      this.selectedCampaignName = this.selectedCampaign.name;
      this.candidatesScoreComparisonChartData = this.generateGeneralScoreComparisonChartData(session, this.selectedCampaign);
    }
  }
  
  toggleCandidatesDisplay(): void {
    this.showAllCandidates = !this.showAllCandidates;
  } 
  
  public generatePDF(): void {
    this.showPrint = true;
    this.showAllCandidates = true;
    setTimeout(() => {

        // Get the container elements
        let firstContainer: any = document.getElementById('first-printed-container');
        let secondContainer: any = document.getElementById('second-printed-container');

        // Generate the PDF after a delay for the first container
        html2canvas(firstContainer, { logging: true, allowTaint: false, useCORS: true }).then((firstCanvas) => {
            // Generate the PDF after a delay for the second container
            html2canvas(secondContainer, { logging: true, allowTaint: false, useCORS: true }).then((secondCanvas) => {
                let fileWidth = 208;
                let fileHeight = 297; // A4 page height is 297mm
                let padding = 20; // Padding around the content

                // Create a new jsPDF instance
                let PDF = new jsPDF('p', 'mm', 'a4');

                // Add the first container content to the first page
                let firstPageHeight = firstCanvas.height * (fileWidth - 2 * padding) / firstCanvas.width;
                let firstPageContentWidth = fileWidth - 2 * padding;
                let firstPageContentX = padding;
                let firstPageContentY = padding;
                PDF.addImage(firstCanvas, 'PNG', firstPageContentX, firstPageContentY, firstPageContentWidth, firstPageHeight, undefined, 'FAST');

                // Add the header for the first page
                PDF.setFontSize(14);
                PDF.text("General Statistics", fileWidth / 2, 10, { align: "center" });

                // Add the page number for the first page
                let totalPages = 2; // Since you know there are 2 pages
                PDF.setFontSize(10);
                PDF.text(`Page 1`, fileWidth / 2, fileHeight - 10, { align: "center" });

                // Add a new page for the second container content
                PDF.addPage();

                // Add the second container content to the second page
                let secondPageHeight = secondCanvas.height * (fileWidth - 2 * padding) / secondCanvas.width;
                let secondPageContentWidth = fileWidth - 2 * padding;
                let secondPageContentX = padding;
                let secondPageContentY = padding;
                PDF.addImage(secondCanvas, 'PNG', secondPageContentX, secondPageContentY, secondPageContentWidth, secondPageHeight, undefined, 'FAST');

                // Add the header for the second page
                PDF.setFontSize(14);
                PDF.text("Candidates LeaderBord", fileWidth / 2, 10, { align: "center" });

                // Add the page number for the second page
                PDF.setFontSize(10);
                PDF.text(`Page 2`, fileWidth / 2, fileHeight - 10, { align: "center" });

                // Save the PDF
                PDF.save('IntershipStatistics.pdf');
                this.showPrint = false;
            });
        });
    }, 500); // Wait for 500 milliseconds
}





  }




