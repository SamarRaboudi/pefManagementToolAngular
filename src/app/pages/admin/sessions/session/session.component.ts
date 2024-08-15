import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SessionService, SessionFilters } from '../../../../core/services/session.service';
import { MatDialog } from '@angular/material/dialog';
import { Session } from '../../../../../app/core/models/session.model';
import { AddSessionComponent } from '../add-session/add-session.component';
import { EditSessionComponent } from '../edit-session/edit-session.component';
import { DeleteSessionComponent } from '../delete-session/delete-session.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [MessageService]
})
export class SessionComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private sessionService: SessionService, public dialog: MatDialog, private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getSessions();
    this.subscribeToSessionAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getSessions(filters: SessionFilters = {}): void {
    const page = 1;
    const limit = 50;

    this.sessionService.getSessions(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
  }

  subscribeToSessionAdded(): void {
    this.sessionService.sessionAdded.subscribe((newSession: Session) => {
      this.getSessions(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchId = parseInt(filterValue.trim()); 
    if (!isNaN(searchId)) {
      this.getSessions({ id: searchId });
    } else {
      this.getSessions({ name: filterValue.trim().toLowerCase() });
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddSessionComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.sessionAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Session added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add session!' });
      }
    });
  }
  openEditDialog(session: Session): void {
    const dialogRef = this.dialog.open(EditSessionComponent, {
      width: '500px',
      data: session

    });
  
    dialogRef.componentInstance.sessionEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Session updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update session!' });
      }
    });
  }
  openDeleteDialog(session: Session): void {
    const dialogRef = this.dialog.open(DeleteSessionComponent, {
      width: '500px',
      data: session

    });
  
    dialogRef.componentInstance.sessionDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Session deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete session!' });
      }
    });
  }
}

