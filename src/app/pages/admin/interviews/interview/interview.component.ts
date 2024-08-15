import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InterviewService, InterviewFilters } from '../../../../core/services/interview.service';
import { MatDialog } from '@angular/material/dialog';
import { Interview } from '../../../../../app/core/models/interview.model';
import { AddInterviewComponent } from '../add-interview/add-interview.component';
import { EditInterviewComponent } from '../edit-interview/edit-interview.component';
import { DeleteInterviewComponent } from '../delete-interview/delete-interview.component';
import { Router } from '@angular/router';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../core/models/session.model';
import { MessageService } from 'primeng/api';
import { AuthorizationService } from '../../../../core/services/authorization.service';


@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss'],
  providers: [MessageService]
})
export class InterviewComponent {
  displayedColumns: string[] = ['candidate', 'users', 'interviewDay', 'interviewTime', 'action'];
  dataSource: MatTableDataSource<any>;
  loggedInUser: User; 
  sessions: Session[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isUserAdmin: boolean = false;
  loading = true;

  constructor(private interviewService: InterviewService,
              private userService: UserService,
              private sessionService: SessionService, 
              private dialog: MatDialog,
              private router: Router,
              private messageService: MessageService, 
              private authorizationService: AuthorizationService,) {
    this.dataSource = new MatTableDataSource<any>();
    this.isUserAdmin = this.authorizationService.hasAccess(['Admin']);
  }

  ngOnInit(): void {
    this.getInterviews();
    this.getSessions(); 
    this.subscribeToInterviewAdded();
    this.fetchLoggedInUser();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getInterviews(filters: InterviewFilters = {}): void {
    const page = 1;
    const limit = 50;
  
    this.interviewService.getInterviews(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      }, (error: any) => {
        console.error('Error fetching interviews:', error);
        this.loading = false;
      });
  }
  
  
  getSessions(): void {
    this.sessionService.getSessions(1, 50, {})
      .subscribe((sessions: Session[]) => {
        this.sessions = [{ id: undefined, name: 'All' }, ...sessions];
      });
  }

  filterBySession(sessionId: number): void {
    this.getInterviews({ sessionId: sessionId });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.getInterviews({ searchQuery: filterValue });
    } else {
      this.getInterviews();
    }
  }
    subscribeToInterviewAdded(): void {
    this.interviewService.interviewAdded.subscribe((newInterview: Interview) => {
      this.getInterviews(); 
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInterviewComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.interviewAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Interview added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add interview!' });
      }
    });
  }
  openEditDialog(interview: Interview): void {
    const dialogRef = this.dialog.open(EditInterviewComponent, {
      width: '500px',
      data: interview

    });
  
    dialogRef.componentInstance.interviewEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Interview updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update interview!' });
      }
    });
  }
  openDeleteDialog(interview: Interview): void {
    const dialogRef = this.dialog.open(DeleteInterviewComponent, {
      width: '500px',
      data: interview

    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openViewInterview(interview: Interview): void {
    this.router.navigate(['interviews/', interview.id]);
  }
  
  fetchLoggedInUser(): void {
    const userEmail = localStorage.getItem('loggedInUserEmail') || '';
    const filters: UserFilters = { searchQuery: userEmail };

    this.userService.getUsers(1, 1, filters).subscribe(
      (data: any) => {
        this.loggedInUser = data[0];
      },
      error => {
        console.error('Error fetching logged-in user:', error);
      }
    );
  }

  shouldDisplayEvaluateButton(interview: Interview): boolean {
    if (!interview.interviewLines || interview.interviewLines.length === 0 || !this.loggedInUser) {
      return false;
    }
    return interview.interviewLines.some(line => line.user && line.user.id === this.loggedInUser.id && !line.isValidated);
  }
  shouldDisplayEvaluatedButton(interview: Interview): boolean {
    if (!interview.interviewLines || interview.interviewLines.length === 0 || !this.loggedInUser) {
      return false;
    }
    return interview.interviewLines.some(line => line.user && line.user.id === this.loggedInUser.id && line.isValidated);
  }
  shouldDisplayValidatedByOthersButton(interview: Interview): boolean {
    if (!interview.interviewLines || interview.interviewLines.length === 0 || !this.loggedInUser) {
      return false;
    }
    return interview.interviewLines.every(line => {
      return line.isValidated && line.user && line.user.id !== this.loggedInUser.id;
    });
  }
  
  
  

  navigateToInterview(interview: Interview, userId:Number): void {
    this.router.navigate(['interviews/', interview.id, userId]);
}

  
  
}
