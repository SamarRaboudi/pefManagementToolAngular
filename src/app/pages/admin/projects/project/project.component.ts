import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ProjectFilters, ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../../app/core/models/project.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TechnologyService } from '../../../../core/services/technology.service';
import { Technology } from '../../../../core/models/technology.model';
import { MatDialog } from '@angular/material/dialog';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { AddProjectComponent } from '../add-project/add-project.component';
import { ViewProjectComponent } from '../view-project/view-project.component';
import { User } from '../../../../core/models/user.model';
import { UserFilters, UserService } from '../../../../core/services/user.service';
import { AuthorizationService } from '../../../../core/services/authorization.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  providers: [MessageService]
})
export class ProjectComponent implements OnInit, OnDestroy{

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  dataSource: MatTableDataSource<Project> = new MatTableDataSource<Project>;
  technologies: any[]; 
  selectedTechnologyId: number | null = null;
  supervisors: User[] = [];
  selectedSupervisorId: number | null = null;
  isUserAdmin: boolean = false;
 loading = true;

  constructor(private changeDetectorRef: ChangeDetectorRef, 
              private projectService: ProjectService, 
              private technologyService: TechnologyService,
              private userService: UserService,
              private authorizationService: AuthorizationService,
              public dialog: MatDialog,
              private messageService: MessageService) {
        this.isUserAdmin = this.authorizationService.hasAccess(['Admin']);
  }

  ngOnInit() {
    this.getProjects();
    this.getTechnologies(); 
    this.getSupervisors();
    this.changeDetectorRef.detectChanges();
    this.obs = this.dataSource.connect();
    this.subscribeToProjectAdded();
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }

  subscribeToProjectAdded(): void {
    this.projectService.projectAdded.subscribe((newProject: Project) => {
      this.getProjects(); 
    });
  }

  getProjects(filters: ProjectFilters = {}): void {
    const page = 1;
    const limit = 50;
    this.projectService.getProjects(page, limit, filters)
      .subscribe((data: any) => {
        data.sort((a: any, b: any) => b.id - a.id);
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 100); 
      });
     
  }

  getTechnologies(): void {
    this.technologyService.getTechnologies(1, 50, {})
      .subscribe((data: Technology[]) => {
        this.technologies = data;
      });
  }
  
  getSupervisors(): void {
    const supervisorFilter: UserFilters = {
      searchQuery: 'Supervisor' 
    };
  
    this.userService.getUsers(1, 50, supervisorFilter).subscribe((supervisors: User[]) => {
      this.supervisors = [{ id: undefined, nom: 'All' }, ...supervisors];
    });
  }

  filterBySupervisor(supervisorId: number): void {
    // Pass supervisorId as filter to getProjects method
    const filters: ProjectFilters = { supervisorId: supervisorId };
    this.getProjects(filters);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const searchId = parseInt(filterValue); 
    if (!isNaN(searchId)) {
      this.getProjects({ id: searchId });
    } else {
      // Check if the filterValue matches any technology label
      const technologyFilter = this.technologies.find(tech => tech.label.toLowerCase() === filterValue);
      if (technologyFilter) {
        this.getProjects({ technologyLabel: technologyFilter.label });
      } else {
        this.getProjects({ title: filterValue });
      }
    }
  }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '900px',
    });
  
    dialogRef.componentInstance.projectAdded.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project added successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add project!' });
      }
    });
  }
  openEditDialog(project: Project): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '900px',
      data: project

    });
  
    dialogRef.componentInstance.projectEdited.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project updated successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project!' });
      }
    });
  }
  openDeleteDialog(project: Project): void {
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      width: '500px',
      data: project

    });
  
    dialogRef.componentInstance.projectDeleted.subscribe((success: boolean) => {
      if (success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project deleted successfully!' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete project!' });
      }
    });
  }
  openViewDetailsDialog(project: Project): void {
    const dialogRef = this.dialog.open(ViewProjectComponent, {
      width: '900px',
      data: project

    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
