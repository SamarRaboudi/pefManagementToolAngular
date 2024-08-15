import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LimitationService, LimitationFilters } from '../../../../core/services/limitation.service';
import { MatDialog } from '@angular/material/dialog';
import { Limitation } from '../../../../../app/core/models/limitation.model';
import { AddLimitationComponent } from '../add-limitation/add-limitation.component';
import { DeleteLimitationComponent } from '../delete-limitation/delete-limitation.component';
import { EditLimitationComponent } from '../edit-limitation/edit-limitation.component';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../../app/core/models/session.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-limitation',
  templateUrl: './limitation.component.html',
  styleUrls: ['./limitation.component.scss'],
  providers: [MessageService]
})
export class LimitationComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'name','session', 'user','candidate', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  sessionColors: string[] = ['primary','accent', 'error', 'success','warning','warning'];
  sessions: Session[] = [];
  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private limitationService: LimitationService, 
              private sessionService: SessionService,
              private router: Router, 
              public dialog: MatDialog,
              private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getLimitations();
    this.getSessions();
    this.subscribeToLimitationAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getLimitations(filters: LimitationFilters = {}): void {
    const page = 1;
    const limit = 50;

    this.limitationService.getLimitations(page, limit, filters)
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

  subscribeToLimitationAdded(): void {
    this.limitationService.limitationAdded.subscribe((newLimitation: Limitation) => {
      this.getLimitations(); 
    });
  }
  
  filterBySession(sessionId: number): void {
    this.getLimitations({ sessionId: sessionId });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (filterValue) {
      this.getLimitations({ searchQuery: filterValue });
    } else {
      this.getLimitations();
    }
  }
  

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddLimitationComponent, {
      width: '500px',
    });
    dialogRef.componentInstance.limitationAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Elimination added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add elimination!' });
      }
    });
  }
  openEditDialog(limitation: Limitation): void {
    const dialogRef = this.dialog.open(EditLimitationComponent, {
      width: '500px',
      data: limitation

    });

    dialogRef.componentInstance.limitationEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Elimination updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update elimination!' });
      }
    });
  
  }
  openDeleteDialog(limitation: Limitation): void {
    const dialogRef = this.dialog.open(DeleteLimitationComponent, {
      width: '500px',
      data: limitation

    });
    dialogRef.componentInstance.limitationDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Elimination deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete elimination!' });
      }
    });
  }
    
   // Method to determine the text color class based on session 
   getTextColor(sessionId: number): string {
    const colorIndex = sessionId % this.sessionColors.length;
    return this.sessionColors[colorIndex];
  }
  
}