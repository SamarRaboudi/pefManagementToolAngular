import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { AddTeamComponent } from './add-team.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from '../../../../core/services/team.service';
import { of } from 'rxjs';
import { Team } from '../../../../../app/core/models/team.model';
import { EventEmitter } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('AddteamComponent', () => {
  let component: AddTeamComponent;
  let fixture: ComponentFixture<AddTeamComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddTeamComponent>>;
  let teamServiceMock: Partial<TeamService>;
  let mockteam: Team;
  

  beforeEach(() => {
    mockteam = { id: 1, name: 'Test team' }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    teamServiceMock = {
      addTeam: jest.fn(() => of(mockteam)), 
      teamAdded: new EventEmitter<Team>(), 
    };

    TestBed.configureTestingModule({
      declarations: [AddTeamComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TeamService, useValue: teamServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize team form with empty name', () => {
    expect(component.teamForm).toBeInstanceOf(FormGroup);
    expect(component.teamForm.controls['name'].value).toEqual('');
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should add team and close dialog when addteam method is called with valid form', fakeAsync(() => {
    component.teamForm = new FormGroup({
      name: new FormControl('New team', [Validators.required]),
      project: new FormControl({ id: 1, name: 'Project 1' }, [Validators.required]), 
      session: new FormControl({ id: 1, name: 'Session 1' }, [Validators.required]), 
      candidates: new FormControl([{ id: 1, name: 'Candidate 1' }], [Validators.required]) 
    });

    const emitSpy = jest.spyOn(component['teamService'].teamAdded, 'emit');

    component.addTeam();

    tick();

    expect(teamServiceMock.addTeam).toHaveBeenCalledWith({
      name: 'New team',
      projects: [{ id: 1, name: 'Project 1' }], 
      session: { id: 1, name: 'Session 1' }, 
      candidates: [{ id: 1, name: 'Candidate 1' }] 
    });

    if (component['teamService'].teamAdded) {
      expect(emitSpy).toHaveBeenCalled();
    }

    expect(matDialogRefMock.close).toHaveBeenCalled();
}));


});
