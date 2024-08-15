import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService, UserFilters } from '../../../../core/services/user.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../../../app/core/models/user.model';
import { Profil } from '../../../../../app/core/models/profil.model';
import { AddUserComponent } from '../add-user/add-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MessageService]
})
export class UserComponent implements AfterViewInit {
  displayedColumns: string[] = [ 'picture',  'nom', 'email','profil', 'action'];
  profilColors: string[] = ['primary','error', 'accent', 'success','warning','success'];
  clickedRows = new Set<any>();
  dataSource: MatTableDataSource<any>;
  profils: Profil[] = [];
  selectedProfilId: number | null = null;
  loading = true;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private userService: UserService, 
              private profilService: ProfilService,
              private router: Router,
              public dialog: MatDialog,
              private messageService: MessageService) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit(): void {
    this.getUsers();
    this.getProfils();    
    this.subscribeToUserAdded();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  subscribeToUserAdded(): void {
    this.userService.userAdded.subscribe((newUser: User) => {
      this.getUsers(); 
    });
  }
  getUsers(filters: UserFilters = {}): void {
    const page = 1;
    const limit = 50;

    this.userService.getUsers(page, limit, filters)
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
    this.getUsers({ profilId: profilId });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    if (filterValue !== '') {
      // If a search query is present
      if (this.selectedProfilId !== null) {
        // If a profile is selected, filter users by both profile and search query
        this.getUsers({ searchQuery: filterValue, profilId: this.selectedProfilId });
      } else {
        // If no profile selected, show all users based on search query
        this.getUsers({ searchQuery: filterValue });
      }
    } else {
      // If no search query
      if (this.selectedProfilId !== null) {
        // If a profile is selected, filter users by profile
        this.getUsers({ profilId: this.selectedProfilId });
      } else {
        // If no profile and no search query, show all users
        this.getUsers();
      }
    }
  }
  
  onProfilSelect(profilId: number | null) {
    this.selectedProfilId = profilId;
    this.getUsers(); 
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '500px',
    });
  
    dialogRef.componentInstance.userAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Collaborator added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add collaborator!' });
      }
    });
  }
  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '500px',
      data: user

    });
  
    dialogRef.componentInstance.userEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Collaborator updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update collaborator!' });
      }
    });
  }
  openDeleteDialog(user: User): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      width: '500px',
      data: user

    });
  
    dialogRef.componentInstance.userDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Collaborator deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete collaborator!' });
      }
    });
  }
  openViewUser(user: User): void {
    this.router.navigate(['users/', user.id]);
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

