import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TechnologyService, TechnologyFilters } from '../../../../core/services/technology.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTechnologyComponent } from '../add-technology/add-technology.component';
import { Technology } from '../../../../../app/core/models/technology.model';
import { EditTechnologyComponent } from '../edit-technology/edit-technology.component';
import { DeleteTechnologyComponent } from '../delete-technology/delete-technology.component';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss'],
  providers: [MessageService]
})
export class TechnologyComponent implements AfterViewInit {
  displayedColumns: string[] = ['logo', 'label', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading = true;

  constructor(private technologyService: TechnologyService, public dialog: MatDialog, private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getTechnologies();
    this.subscribeToTechnologyAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getTechnologies(filters: TechnologyFilters = {}): void {
    const page = 1;
    const limit = 50;
  
    this.technologyService.getTechnologies(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
  }


  subscribeToTechnologyAdded(): void {
    this.technologyService.technologyAdded.subscribe((newTechnology: Technology) => {
      this.getTechnologies(); 
    //  this.toastr.success('Technology added successfully!', 'Success');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchId = parseInt(filterValue.trim()); 
    if (!isNaN(searchId)) {
      this.getTechnologies({ id: searchId });
    } else {
      this.getTechnologies({ label: filterValue.trim().toLowerCase() });
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddTechnologyComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.technologyAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Technology added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add technology!' });
      }
    });
  }
  

  openEditDialog(technology: Technology): void {
    const dialogRef = this.dialog.open(EditTechnologyComponent, {
      width: '500px',
      data: technology

    });
  
    dialogRef.componentInstance.technologyEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Technology updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update technology!' });
      }
    });
  }

  openDeleteDialog(technology: Technology): void {
    const dialogRef = this.dialog.open(DeleteTechnologyComponent, {
      width: '500px',
      data: technology

    });
  
    dialogRef.componentInstance.technologyDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Technology deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete technology!' });
      }
    });
  }

  onSuccessToastr(){
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
  }
}
