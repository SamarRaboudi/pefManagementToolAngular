import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamComponent } from './team.component';
import { MatDialog } from '@angular/material/dialog';
import { TeamService } from '../../../../core/services/team.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

class MockTeamService {
  getTeams = jest.fn(() => of([]));
  teamAdded = new EventEmitter<any>();
}

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;
  let teamServiceMock: MockTeamService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    teamServiceMock = new MockTeamService(); 

    matDialogMock = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [ TeamComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: TeamService, useValue: teamServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
