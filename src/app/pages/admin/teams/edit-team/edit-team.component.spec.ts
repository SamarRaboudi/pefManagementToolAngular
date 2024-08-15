import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamService } from '../../../../core/services/team.service';
import { EditTeamComponent } from './edit-team.component';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team } from '../../../../../app/core/models/team.model';
import { HttpClientModule } from '@angular/common/http';

describe('EditTeamComponent', () => {
  let component: EditTeamComponent;
  let fixture: ComponentFixture<EditTeamComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditTeamComponent>>;
  let teamServiceMock: Partial<TeamService>;
  let mockTeam: Team;

  beforeEach(async () => {
    mockTeam = { id: 1, name: 'Test Team', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    teamServiceMock = {
      updateTeam: jest.fn(() => of(mockTeam)),
      teamAdded: new EventEmitter<Team>(),
    };

    await TestBed.configureTestingModule({
      declarations: [EditTeamComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TeamService, useValue: teamServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockTeam },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('editTeam', () => {
    it('should not call updateTeam when form is invalid', () => {
      const spy = jest.spyOn(teamServiceMock, 'updateTeam');
      component.editTeam();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should call updateTeam with correct parameters when form is valid', () => {
      const spy = jest.spyOn(teamServiceMock, 'updateTeam');
      component.teamForm.setValue({
        name: 'Updated Team Name',
        project: 1,
        session: 1,
        candidates: [1, 2],
      });
      component.editTeam();
      expect(spy).toHaveBeenCalledWith(mockTeam.id, {
        name: 'Updated Team Name',
        projects: [1],
        session: 1,
        candidates: [1, 2],
        isActive: true, // Assuming isActive is true for the mockTeam
      });
    });

    it('should close dialog with updatedTeamResponse when update is successful', () => {
      const dialogRefSpy = jest.spyOn(matDialogRefMock, 'close');
      component.teamForm.setValue({
        name: 'Updated Team Name',
        project: 1,
        session: 1,
        candidates: [1, 2],
      });
      component.editTeam();
      expect(dialogRefSpy).toHaveBeenCalledWith(mockTeam);
    });

    it('should emit teamEdited with true when update is successful', () => {
      const emitSpy = jest.spyOn(component.teamEdited, 'emit');
      component.teamForm.setValue({
        name: 'Updated Team Name',
        project: 1,
        session: 1,
        candidates: [1, 2],
      });
      component.editTeam();
      expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('should emit teamEdited with false when update fails', () => {
      const emitSpy = jest.spyOn(component.teamEdited, 'emit');
      const error = new Error('Failed to update team');
      jest.spyOn(teamServiceMock, 'updateTeam').mockReturnValue(throwError(error));
      component.teamForm.setValue({
        name: 'Updated Team Name',
        project: 1,
        session: 1,
        candidates: [1, 2],
      });
      component.editTeam();
      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });
});
