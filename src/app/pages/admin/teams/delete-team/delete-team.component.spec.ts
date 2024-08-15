import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamService } from '../../../../core/services/team.service';
import { DeleteTeamComponent } from './delete-team.component';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team } from '../../../../../app/core/models/team.model';

describe('DeleteTeamComponent', () => {
  let component: DeleteTeamComponent;
  let fixture: ComponentFixture<DeleteTeamComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteTeamComponent>>;
  let teamServiceMock: Partial<TeamService>;
  let mockTeam: Team;

  beforeEach(async () => {
    mockTeam = { id: 1, name: 'Test team', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    teamServiceMock = {
      updateTeam: jest.fn(() => of(mockTeam)),
      teamAdded: new EventEmitter<Team>(),
    };

    await TestBed.configureTestingModule({
      declarations: [DeleteTeamComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TeamService, useValue: teamServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockTeam },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


    it('should call updateTeam with correct payload when team and ID are valid', () => {
      const spy = jest.spyOn(teamServiceMock, 'updateTeam');
      component.deleteTeam();
      expect(spy).toHaveBeenCalledWith(mockTeam.id, {
        name: mockTeam.name,
        isActive: false,
      });
    });

    it('should emit teamDeleted with false when update is successful', () => {
      const emitSpy = jest.spyOn(component.teamDeleted, 'emit');
      component.deleteTeam();
      expect(emitSpy).toHaveBeenCalledWith(false);
    });

    it('should close dialog when update is successful', () => {
      const closeSpy = jest.spyOn(matDialogRefMock, 'close');
      component.deleteTeam();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should emit teamDeleted with false when update fails', () => {
      const emitSpy = jest.spyOn(component.teamDeleted, 'emit');
      const error = new Error('Failed to update team');
      jest.spyOn(teamServiceMock, 'updateTeam').mockReturnValue(throwError(error));
      component.deleteTeam();
      expect(emitSpy).toHaveBeenCalledWith(false);
    });
  });


