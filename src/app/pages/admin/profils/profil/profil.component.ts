import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProfilService, ProfilFilters } from '../../../../core/services/profil.service';
import { MatDialog } from '@angular/material/dialog';
import { AddProfilComponent } from '../add-profil/add-profil.component';
import { Profil } from 'src/app/core/models/profil.model';
import { EditProfilComponent } from '../edit-profil/edit-profil.component';
import { DeleteProfilComponent } from '../delete-profil/delete-profil.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements AfterViewInit {
  displayedColumns: string[] = ['titre', 'action'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  loading = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private profilService: ProfilService, public dialog: MatDialog,private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getProfils();
    this.subscribeToProfilAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getProfils(filters: ProfilFilters = {}): void {
    const page = 1;
    const limit = 50;

    this.profilService.getProfils(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
  }

  subscribeToProfilAdded(): void {
    this.profilService.profilAdded.subscribe((newProfil: Profil) => {
      this.getProfils(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const searchId = parseInt(filterValue.trim()); 
    if (!isNaN(searchId)) {
      this.getProfils({ id: searchId });
    } else {
      this.getProfils({ titre: filterValue.trim().toLowerCase() });
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProfilComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.profilAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add profile!' });
      }
    });
  }
  openEditDialog(profil: Profil): void {
    const dialogRef = this.dialog.open(EditProfilComponent, {
      width: '500px',
      data: profil

    });
  
    dialogRef.componentInstance.profilEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update profile!' });
      }
    });
  }
  openDeleteDialog(profil: Profil): void {
    const dialogRef = this.dialog.open(DeleteProfilComponent, {
      width: '500px',
      data: profil

    });
  
    dialogRef.componentInstance.profilDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete profile!' });
      }
    });
  }
}
