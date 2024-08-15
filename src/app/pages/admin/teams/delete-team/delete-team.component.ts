import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamService } from '../../../../core/services/team.service';
import { Team } from '../../../../../app/core/models/team.model';

@Component({
  selector: 'app-delete-team',
  templateUrl: './delete-team.component.html',
  styleUrls: ['./delete-team.component.scss']
})
export class DeleteTeamComponent {
  team: Team;
  @Output() teamDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteTeamComponent>,
    private teamService: TeamService,
    @Inject(MAT_DIALOG_DATA) public data: Team
  ) {
    this.team = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteTeam(): void {
    if (!this.team || !this.team.id) {
      console.error('Cannot delete team: Invalid team or ID is missing.');
      return;
    }

    let payload: any = {
      name: this.team.name,
      isActive: false
    };

    if (Array.isArray(this.team.projects) && this.team.projects.length > 0) { 
      payload.projects = this.team.projects.map(project => project.id);
    }
    if (typeof this.team.session === 'object' && this.team.session !== null) {
      payload.session = this.team.session.id;
    }

    this.teamService.updateTeam(this.team.id, payload).subscribe(
      (updatedTeam: Team) => {
        this.teamService.teamAdded.emit(updatedTeam);
        this.teamDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update team:', error);
        this.teamDeleted.emit(false);
      }
    );
  }
}
