import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CandidateService, CandidateFilters } from '../../../../../app/core/services/candidate.service';
import { Candidate } from '../../../../../app/core/models/candidate.model';
import { CampaignService } from '../../../../core/services/campaign.service';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Criteria } from '../../../../core/models/criteria.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}



@Component({
  selector: 'app-view-candidate',
  templateUrl: './view-candidate.component.html',
  styleUrls: ['./view-candidate.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ViewCandidateComponent implements OnInit {
  panelOpenState = false;
  candidateForm: FormGroup;
  candidate: Candidate;
  evaluationData:any;
  candidateId: number;
  showSkillInput: boolean = false;
  newSkill: string = '';
  photoLink: any;
  hoveredSkill: string | null = null;
  loading = true;
  evaluationCriteria: Criteria[] = [];
  displayedColumns: string[] = [];
  selectedRemarks: { [key: number]: string } = {};
  columnsToDisplay: string[] = [];
  columnsToDisplayWithExpand: string[] = [];
  expandedElement: PeriodicElement | null;
  scores: number[] = [];
  expandedRowIndex: number | null = null;
  expandedRowIndices: number[] = [];
  basicData: any;
  basicOptions: any;
  chartData: any;
  chartOptions: any;
  colors: string[] = ['#BBD0FF', '#FFE3B4', '#B7E6FF', '#FFC7B5', '#e6fffa', '#ffe5ec', '#00C851'];
  showPrint = false;


  constructor(private route: ActivatedRoute, 
              private candidateService: CandidateService,
              private campaignService: CampaignService,
              private criteriaService: CriteriaService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.candidateId = +params['id']; 
      this.fetchCandidateData();
      this.fetchCandidateEvaluationData();
    });
    
    this.initializeForm();
    this.getEvaluationCriteria();
  }


  fetchCandidateData(): void {
    this.loading = true;
    this.candidateService.getCandidateById(this.candidateId).subscribe(
        (response: any) => {
            if (response) {
              this.candidate = response;
              this.photoLink = this.candidate.picture;
            } else {
                console.error('Candidate with ID', this.candidateId, 'not found.');
            }
            this.generateCriteriaChartData();
            this.loading = false;
        },
        (error) => {
            console.error('Error fetching candidate data:', error);
            this.loading = false;
        }
    );
}

getEvaluationCriteria(): void {
  this.criteriaService.getCriterias(1, 50, {}).subscribe((criterias: Criteria[]) => {
    this.evaluationCriteria = criterias || []; // Ensure evaluationCriteria is initialized
    this.columnsToDisplay = ['Evaluator', ...this.evaluationCriteria.map(criteria => criteria.name).filter(name => name !== undefined) as string[], 'Final Note'];
    this.columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  });
}


fetchCandidateEvaluationData(): void {
  this.campaignService.getCandidateAllEvaluationData(this.candidateId).subscribe(
    (data: any[]) => {
      console.log(data)
      this.evaluationData = data;

      this.updateChartData(this.evaluationData);

    },
    error => {
      console.error('Error fetching candidate evaluation data:', error);
    }
  );
}

updateChartData(evaluationData: any[]): void {
  const labels: string[] = [];
  const scores: number[] = [];

  // Loop through each array of campaigns
  evaluationData.forEach((campaignArray: any[]) => {
    // Loop through each campaign in the array
    campaignArray.forEach((campaign: any) => {
      // Extract the score from the first evaluation in the campaign
      const score = campaign.evaluations.length > 0 ? campaign.evaluations[0].score : 0;

      // Add campaign name and score to labels and scores arrays
      labels.push(campaign.name);
      scores.push(score);
    });
  });

  // Update basicData object with new labels and scores
  this.basicData = {
    labels: labels,
    datasets: [
      {
        label: 'Scores',
        data: scores,
        backgroundColor: 'rgba(143, 178, 255, 0.2)', // Fill color
        borderColor: 'rgba(143, 178, 255, 1)', // Line color
        borderWidth: 1,
        fill: true // Enable fill for the line chart
      }
    ]
  };
}


generateCriteriaChartData(): void {
  // Initialize an object to store the average grades for each criterion by campaign
  const campaignCriterionGradesSummary: { [campaignName: string]: { [criterionId: number]: { total: number, count: number } } } = {};

  // Loop through evaluation data
  this.evaluationData.forEach((campaignArray: any[]) => {
      campaignArray.forEach((campaign: any) => {
          const campaignName = campaign.name;
          campaign.evaluations.forEach((evaluation: any) => {
              evaluation.evaluationLines.forEach((evaluationLine: any) => {
                  this.evaluationCriteria.forEach((criteria: Criteria) => {
                      // Check if evaluationLine has evaluationLineCriteriaGrades and the criterion id exists
                      if (criteria.id && evaluationLine.evaluator.evaluationLineCriteriaGrades.hasOwnProperty(criteria.id)) {
                          // Get the grade for this criterion
                          const grade = evaluationLine.evaluator.evaluationLineCriteriaGrades[criteria.id];

                          // Update the summary object for this criterion within the current campaign
                          if (!campaignCriterionGradesSummary[campaignName]) {
                              campaignCriterionGradesSummary[campaignName] = {};
                          }
                          if (!campaignCriterionGradesSummary[campaignName][criteria.id]) {
                              campaignCriterionGradesSummary[campaignName][criteria.id] = { total: 0, count: 0 };
                          }
                          campaignCriterionGradesSummary[campaignName][criteria.id].total += grade;
                          campaignCriterionGradesSummary[campaignName][criteria.id].count++;
                      }
                  });
              });
          });
      });
  });

  // Calculate the average grade for each criterion by campaign
  const averageCampaignCriterionGrades: { [campaignName: string]: { [criterionId: number]: number } } = {};
  Object.keys(campaignCriterionGradesSummary).forEach((campaignName: string) => {
      averageCampaignCriterionGrades[campaignName] = {};
      Object.keys(campaignCriterionGradesSummary[campaignName]).forEach((criterionId: string) => {
          const id = parseInt(criterionId, 10);
          averageCampaignCriterionGrades[campaignName][id] = campaignCriterionGradesSummary[campaignName][id].total / campaignCriterionGradesSummary[campaignName][id].count;
      });
  });

  this.updateCriteriasChartData(this.evaluationData, averageCampaignCriterionGrades);
}

updateCriteriasChartData(evaluationData: any[], averageCampaignCriterionGrades: any): void {
  const labels: string[] = Object.keys(averageCampaignCriterionGrades);
  const datasets = this.evaluationCriteria.map((criteria: Criteria, index: number) => {
      const data = labels.map((campaignName: string) => {
          const criterionGrades = averageCampaignCriterionGrades[campaignName];
          return criterionGrades && criteria.id ? criterionGrades[criteria.id] || 0 : 0;
      });
      return {
          label: criteria.name,
          data: data,
          borderColor: this.colors[index % this.colors.length], // Use colors from the defined array
          borderWidth: 3,
          fill: false // Disable fill to show lines only
      };
  });

  this.chartData = {
      labels: labels,
      datasets: datasets
  };
}






getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}






  initializeForm(): void {
    this.candidateForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      skills: new FormControl('')
    });
  }

  toggleSkillInput(): void {
    this.showSkillInput = !this.showSkillInput;
  }

  addSkill(): void {
    if (this.newSkill.trim() !== '') {
      if (!this.candidate.skills) {
        this.candidate.skills = [];
      }
      this.candidate.skills.push(this.newSkill);
      // Call updateCandidate to save the changes to the database
      this.updateCandidate();
      this.newSkill = '';
      this.showSkillInput = false;
    }
  }

  showDeleteButton(skill: string): void {
    this.hoveredSkill = skill;
  }
  
  hideDeleteButton(skill: string): void {
    if (this.hoveredSkill === skill) {
      this.hoveredSkill = null;
    }
  }
  
  isHovered(skill: string): boolean {
    return this.hoveredSkill === skill;
  }
  
  deleteSkill(skill: string): void {
    if (this.candidate && this.candidate.skills) {
      const index = this.candidate.skills.indexOf(skill);
      if (index !== -1) {
        this.candidate.skills.splice(index, 1);
        this.updateCandidate();
      }
    }
  }  

  updateCandidate(): void {
    if (!this.candidate || !this.candidate.id) {
      console.error('Cannot delete candidate: Invalid candidate or ID is missing.');
      return;
    }
        const candidate: Candidate = {
          firstName: this.candidate.firstName,
          lastName: this.candidate.lastName,
          email: this.candidate.email,
          skills: this.candidate.skills,
          isActive: true
        };
        this.candidateId = this.candidate.id;
        this.candidateService.updateCandidate(this.candidateId, candidate).subscribe(
          (updatedCandidate: Candidate) => {
           // this.candidateService.candidateAdded.emit(updatedCandidate);
          },
          (error) => {
            console.error('Failed to delete candidate:', error);
          }
        );
  }
  

  sendEmail(): void {
    if (this.candidate && this.candidate.email) {
      window.location.href = `mailto:${this.candidate.email}`;
    } else {
      console.error('Candidate email is not defined.');
      // Handle error (e.g., show error message to user)
    }
  }
  cancelAddSkill(): void {
    this.newSkill = '';
    this.showSkillInput = false;
  }

  
  isCampaignFinished(endDate: string): boolean {
    const today = new Date();
    const campaignEndDate = new Date(endDate);
    return campaignEndDate < today;
}

isCampaignInProgress(startDate: string, endDate: string): boolean {
    const today = new Date();
    const campaignStartDate = new Date(startDate);
    const campaignEndDate = new Date(endDate);
    return campaignStartDate <= today && today <= campaignEndDate;
}

isCampaignNotStartedYet(startDate: string): boolean {
    const today = new Date();
    const campaignStartDate = new Date(startDate);
    return campaignStartDate > today;
}

toggleRowExpansion(index: number): void {
  const currentIndex = this.expandedRowIndices.indexOf(index);
  if (currentIndex === -1) {
    this.expandedRowIndices.push(index);
  } else {
    this.expandedRowIndices.splice(currentIndex, 1);
  }
}

isRowExpanded(index: number): boolean {
  return this.expandedRowIndices.includes(index);
}
isFirstPanel(index: number): boolean {
  return index === 0; 
}
public generatePDF(): void {
  this.showPrint = true;
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

              // Total number of pages
              let totalPages = 2;

              // Add the first container content to the first page
              let firstPageHeight = firstCanvas.height * fileWidth / firstCanvas.width;
              let scaleFirst = fileWidth / firstCanvas.width;
              let firstPageContentHeight = firstPageHeight - (2 * padding);
              let firstPageContentWidth = firstCanvas.width * scaleFirst;
              let firstPageContentX = (fileWidth - firstPageContentWidth) / 2;
              let firstPageContentY = padding;
              PDF.addImage(firstCanvas, 'PNG', firstPageContentX, firstPageContentY, firstPageContentWidth, firstPageContentHeight, undefined, 'FAST');

              // Add the header for the first page
              PDF.setFontSize(14);
              PDF.text("Candidate Progress Statistics", fileWidth / 2, 10, { align: "center" });

              // Add the page number for the first page
              PDF.setFontSize(10);
              PDF.text(`Page 1`, fileWidth / 2, fileHeight - 10, { align: "center" });

              // Add a new page for the second container content
              PDF.addPage();

              // Add the second container content to the second page
              let secondPageHeight = secondCanvas.height * fileWidth / secondCanvas.width;
              let scaleSecond = fileWidth / secondCanvas.width;
              let secondPageContentHeight = secondPageHeight - (2 * padding);
              let secondPageContentWidth = secondCanvas.width * scaleSecond;
              let secondPageContentX = (fileWidth - secondPageContentWidth) / 2;
              let secondPageContentY = padding;
              PDF.addImage(secondCanvas, 'PNG', secondPageContentX, secondPageContentY, secondPageContentWidth, secondPageContentHeight, undefined, 'FAST');

              // Add the header for the second page
              PDF.setFontSize(14);
              PDF.text("Candidate Evaluations", fileWidth / 2, 10, { align: "center" });

              // Add the page number for the second page
              PDF.setFontSize(10);
              PDF.text(`Page 2`, fileWidth / 2, fileHeight - 10, { align: "center" });

              // Save the PDF
              PDF.save('CandidatePage.pdf');
              this.showPrint = false;
          });
      });
  }, 500); // Wait for 500 milliseconds
}





}
