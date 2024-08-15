import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriteriaComponent } from './criteria.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DeleteCriteriaComponent } from '../delete-criteria/delete-criteria.component';
import { EditCriteriaComponent } from '../edit-criteria/edit-criteria.component';
import { AddCriteriaComponent } from '../add-criteria/add-criteria.component';

class MockCriteriaService {
  getCriterias = jest.fn(() => of([]));
  criteriaAdded = new EventEmitter<any>();
}

class MockProfilService {
  getProfils = jest.fn(() => of([{ id: 1, titre: 'Profil 1' }]));
}

describe('CriteriaComponent', () => {
  let component: CriteriaComponent;
  let fixture: ComponentFixture<CriteriaComponent>;
  let criteriaServiceMock: MockCriteriaService;
  let profilServiceMock: MockProfilService;
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    criteriaServiceMock = new MockCriteriaService();
    profilServiceMock = new MockProfilService();

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ CriteriaComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: ProfilService, useValue: profilServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MessageService },
        { provide: Router, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with getCriterias and getProfils', () => {
    jest.spyOn(component, 'getCriterias');
    jest.spyOn(component, 'getProfils');
    
    component.ngOnInit();
    
    expect(component.getCriterias).toHaveBeenCalled();
    expect(component.getProfils).toHaveBeenCalled();
  });

  it('should set paginator after view init', () => {
    component.paginator = { pageSize: 50, pageIndex: 0 } as MatPaginator;
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should apply filter', () => {
    const filterEvent = { target: { value: 'test' } } as unknown as Event;
    jest.spyOn(component, 'getCriterias');
    component.applyFilter(filterEvent);
    expect(component.getCriterias).toHaveBeenCalledWith({ searchQuery: 'test', profilId: null });
  });

  it('should filter by profil', () => {
    jest.spyOn(component, 'getCriterias');
    component.filterByProfil(1);
    expect(component.selectedProfilId).toBe(1);
    expect(component.getCriterias).toHaveBeenCalled();
  });

 
  it('should call getCriterias on criteriaAdded event', () => {
    jest.spyOn(component, 'getCriterias');
    component.subscribeToCriteriaAdded();
    criteriaServiceMock.criteriaAdded.emit();
    expect(component.getCriterias).toHaveBeenCalled();
  });

  it('should handle getProfils response', () => {
    component.getProfils();
    expect(profilServiceMock.getProfils).toHaveBeenCalled();
    profilServiceMock.getProfils().subscribe(profils => {
      expect(component.profils).toEqual([{ id: undefined, titre: 'All' }, ...profils]);
    });
  });

  it('should set the correct text color based on profilId', () => {
    const color = component.getTextColor(1);
    expect(color).toBeDefined();
  });
});
