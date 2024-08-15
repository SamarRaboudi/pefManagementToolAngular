import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCampaignComponent } from '../add-campaign/add-campaign.component';
import { FormControl, FormGroup } from '@angular/forms';
import { CampaignFilters, CampaignService } from '../../../../core/services/campaign.service';
import { Campaign } from '../../../../../app/core/models/campaign.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../../app/core/models/session.model';
import { DeleteCampaignComponent } from '../delete-campaign/delete-campaign.component';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
  providers: [MessageService]
})
export class CampaignComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'session', 'startDate', 'endDate','status', 'action'];
  sessionColors: string[] = ['primary','accent', 'error', 'success','warning','warning'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  sessions: Session[] = [];
  loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private campaignService: CampaignService, 
              private sessionService: SessionService,
              public dialog: MatDialog, 
              private router: Router,
              private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getCampaigns();
    this.getSessions();
    this.subscribeToCampaignAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getCampaigns(filters: CampaignFilters = {}): void {
    const page = 1;
    const limit = 50;
  
    this.campaignService.getCampaigns(page, limit, filters)
      .subscribe((data: any) => {
        // Sort the data array in descending order based on the campaign's ID
        data.sort((a: any, b: any) => b.id - a.id);
        
        this.dataSource.data = data;
        
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
  }
  getSessions(): void {
    this.sessionService.getSessions(1, 50, {})
      .subscribe((sessions: Session[]) => {
        this.sessions = [{ id: undefined, name: 'All' }, ...sessions];
      });
  }
  filterBySession(sessionId: number): void {
    this.getCampaigns({ sessionId: sessionId });
  }

  subscribeToCampaignAdded(): void {
    this.campaignService.campaignAdded.subscribe((newcampaign: Campaign) => {
      this.getCampaigns(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.getCampaigns({ searchQuery: filterValue });
    } else {
      this.getCampaigns();
    }
  }
  
  

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCampaignComponent, {
      width: '700px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openDeleteDialog(campaign: Campaign): void {
    const dialogRef = this.dialog.open(DeleteCampaignComponent, {
      width: '500px',
      data: campaign

    });

    dialogRef.componentInstance.campaignDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Camapaign deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete campaign!' });
      }
    });
  }
  openViewcampaign(campaign: Campaign): void {
    // Navigate to the view campaign component with campaign ID
    this.router.navigate(['campaigns/', campaign.id]);
  }
  getTextColor(sessionId: number): string {
    const colorIndex = sessionId % this.sessionColors.length;
    return this.sessionColors[colorIndex];
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

  getStatusText(isValid: boolean, startDate: string, endDate: string): string {
    if (!isValid) {
      return 'Not Validated Yet';
    } else if (this.isCampaignInProgress(startDate, endDate)) {
      return 'In Progress';
    } else if (this.isCampaignFinished(endDate)) {
      return 'Finished';
    } else {
      return 'Not Started Yet';
    }
  }
  
  getStatusColor(isValid: boolean, startDate: string, endDate: string): string {
    if (!isValid) {
      return 'error';
    } else if (this.isCampaignInProgress(startDate, endDate)) {
      return 'success';
    } else if (this.isCampaignFinished(endDate)) {
      return 'warning';
    } else {
      return 'accent';
    }
  }
  

}
