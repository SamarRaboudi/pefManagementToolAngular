import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TeamService, TeamFilters } from '../../../../core/services/team.service';
import { MatDialog } from '@angular/material/dialog';
import { Team } from '../../../../../app/core/models/team.model';
import { AddTeamComponent } from '../add-team/add-team.component';
import { DeleteTeamComponent } from '../delete-team/delete-team.component';
import { EditTeamComponent } from '../edit-team/edit-team.component';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../../app/core/models/session.model';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  providers: [MessageService]
})
export class TeamComponent implements AfterViewInit {
  displayedColumns: string[] = ['name','session', 'project','candidate', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  sessionColors: string[] = ['primary','accent', 'error', 'success','warning','warning'];
  sessions: Session[] = [];
  isUserAdmin: boolean = false;
  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private teamService: TeamService, 
              private sessionService: SessionService,
              private router: Router, 
              private authorizationService: AuthorizationService,
              public dialog: MatDialog,
              private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
    this.isUserAdmin = this.authorizationService.hasAccess(['Admin']);
  }

  ngOnInit(): void {
    this.getTeams();
    this.getSessions();
    this.subscribeToTeamAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getTeams(filters: TeamFilters = {}): void {
    const page = 1;
    const limit = 50;

    this.teamService.getTeams(page, limit, filters)
      .subscribe((data: any) => {
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

  subscribeToTeamAdded(): void {
    this.teamService.teamAdded.subscribe((newTeam: Team) => {
      this.getTeams(); 
    });
  }
  
  filterBySession(sessionId: number): void {
    this.getTeams({ sessionId: sessionId });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.getTeams({ searchQuery: filterValue });
    } else {
      this.getTeams();
    }
  }
  

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddTeamComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.teamAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add team!' });
      }
    });
  }
  openEditDialog(team: Team): void {
    const dialogRef = this.dialog.open(EditTeamComponent, {
      width: '500px',
      data: team

    });
  
    dialogRef.componentInstance.teamEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update team!' });
      }
    });
  }
  openDeleteDialog(team: Team): void {
    const dialogRef = this.dialog.open(DeleteTeamComponent, {
      width: '500px',
      data: team

    });
  
    dialogRef.componentInstance.teamDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team!' });
      }
    });
  }
    
   // Method to determine the text color class based on session 
   getTextColor(sessionId: number): string {
    const colorIndex = sessionId % this.sessionColors.length;
    return this.sessionColors[colorIndex];
  }

  ViewTeamEvaluationDetails(teamId: number) {
    this.router.navigateByUrl(`dashboard/admin/team/${teamId}`);
  }
  
}