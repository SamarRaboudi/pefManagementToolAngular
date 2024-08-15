import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CandidateFilters, CandidateService } from '../../../../core/services/candidate.service';
import { MatDialog } from '@angular/material/dialog';
import { Candidate } from '../../../../../app/core/models/candidate.model';
import { AddCandidateComponent } from '../add-candidate/add-candidate.component';
import { EditCandidateComponent } from '../edit-candidate/edit-candidate.component';
import { DeleteCandidateComponent } from '../delete-candidate/delete-candidate.component';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss'],
  providers: [MessageService]
})
export class CandidateComponent implements AfterViewInit {
  displayedColumns: string[] = ['picture', 'name', 'email', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  loading = true;
  isUserAdmin: boolean = false;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private candidateService: CandidateService, 
              private authorizationService: AuthorizationService,
              public dialog: MatDialog, private router: Router,
              private messageService: MessageService) {
    this.isUserAdmin = this.authorizationService.hasAccess(['Admin']);
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getCandidates();
    this.subscribeToCandidateAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getCandidates(filters: CandidateFilters = {}): void {
    const page = 1;
    const limit = 50;
  
    this.candidateService.getCandidates(page, limit, filters)
      .subscribe((data: any) => {
        // Sort the data array in descending order based on the candidate's ID
        data.sort((a: any, b: any) => b.id - a.id);
        
        this.dataSource.data = data;
        
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
  }

  subscribeToCandidateAdded(): void {
    this.candidateService.candidateAdded.subscribe((newCandidate: Candidate) => {
      this.getCandidates(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Trim and convert to lowercase
    const searchId = parseInt(filterValue);
    
    if (!isNaN(searchId)) {
      // If the input is a valid number, filter by ID
      this.getCandidates({ id: searchId });
    } else {
      const spaceIndex = filterValue.indexOf(' ');
  
      if (spaceIndex !== -1) {
        // If space exists, assume both first and last names are provided
        const firstName = filterValue.slice(0, spaceIndex).trim();
        const lastName = filterValue.slice(spaceIndex + 1).trim();
  
        // Filter by both first and last names
        this.getCandidates({ firstName: firstName, lastName: lastName });
      } else {
        // If no space exists and it's not a valid ID, filter by last name alone
        this.getCandidates({ lastName: filterValue });
      }
    }
  }
  

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCandidateComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.candidateAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidate added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add candidate!' });
      }
    });
  }
  openEditDialog(candidate: Candidate): void {
    const dialogRef = this.dialog.open(EditCandidateComponent, {
      width: '500px',
      data: candidate

    });
  
    dialogRef.componentInstance.candidateEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidate updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update candidate!' });
      }
    });
  }
  openDeleteDialog(candidate: Candidate): void {
    const dialogRef = this.dialog.open(DeleteCandidateComponent, {
      width: '500px',
      data: candidate

    });
  
    dialogRef.componentInstance.candidateDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Candidate deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete candidate!' });
      }
    });
  }
  openViewCandidate(candidate: Candidate): void {
    // Navigate to the view candidate component with candidate ID
    this.router.navigate(['candidates/', candidate.id]);
  }
  
}
