import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CriteriaService, CriteriaFilters } from '../../../../core/services/criteria.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { MatDialog } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';
import { Profil } from '../../../../../app/core/models/profil.model';
import { AddCriteriaComponent } from '../add-criteria/add-criteria.component';
import { DeleteCriteriaComponent } from '../delete-criteria/delete-criteria.component';
import { EditCriteriaComponent } from '../edit-criteria/edit-criteria.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
  providers: [MessageService]
})
export class CriteriaComponent implements AfterViewInit {
  displayedColumns: string[] = ['name','value','profil','action'];
  profilColors: string[] = ['accent','primary', 'warning', 'success','pink','success'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  profils: Profil[] = [];
  selectedProfilId: number | null = null;
  loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private criteriaService: CriteriaService, 
              private profilService: ProfilService,
              private router: Router, 
              public dialog: MatDialog,
              private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getCriterias();
    this.getProfils();    
    this.subscribeToCriteriaAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  subscribeToCriteriaAdded(): void {
    this.criteriaService.criteriaAdded.subscribe((newCriteria: Criteria) => {
      this.getCriterias(); 
    });
  }

  getCriterias(filters: CriteriaFilters = {}): void {
    const page = 1;
    const limit = 50;

    // Pass the selected profile ID to the service
    filters['profilId'] = this.selectedProfilId;

    this.criteriaService.getCriterias(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
    
  }

  getProfils(): void {
    this.profilService.getProfils(1, 50, {})
      .subscribe((profils: Profil[]) => {
        this.profils = [{ id: undefined, titre: 'All' }, ...profils]; 
      });
  }

  filterByProfil(profilId: number): void {
    // Update selected profile ID
    this.selectedProfilId = profilId;

    // Call getCriterias with updated filters
    this.getCriterias();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    if (filterValue !== '') {
      // If a search query is present, call getCriterias with updated filters
      this.getCriterias({ searchQuery: filterValue });
    } else {
      // If no search query, call getCriterias with updated filters
      this.getCriterias();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.criteriaAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Evaluation criteria added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add Evaluation criteria!' });
      }
    });
  }

  openEditDialog(criteria: Criteria): void {
    const dialogRef = this.dialog.open(EditCriteriaComponent, {
      width: '500px',
      data: criteria
    });
  
    dialogRef.componentInstance.criteriaEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Evaluation criteria updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update evaluation criteria!' });
      }
    });
  }

  openDeleteDialog(criteria: Criteria): void {
    const dialogRef = this.dialog.open(DeleteCriteriaComponent, {
      width: '500px',
      data: criteria
    });
  
    dialogRef.componentInstance.criteriaDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Evaluation criteria deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete evaluation criteria!' });
      }
    });
  }
  getTextColor(profilId: number): string {
    const hash = profilId.toString().split('').reduce((acc, char) => {
        acc = ((acc << 5) - acc) + char.charCodeAt(0);
        return acc & acc;
    }, 0);
    const colorIndex = Math.abs(hash) % this.profilColors.length;
    return this.profilColors[colorIndex];
}

}
