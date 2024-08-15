import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team } from '../../../../../app/core/models/team.model';
import { TeamService } from '../../../../core/services/team.service';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../../app/core/models/project.model';
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../../app/core/services/session.service';
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 

@Component({
  selector: 'app-edit-team',
  templateUrl: './edit-team.component.html',
  styleUrls: ['./edit-team.component.scss']
})
export class EditTeamComponent implements OnInit {
  teamForm: FormGroup;
  team: Team;
  teamId: number;
  projects: Project[] = [];
  sessions: Session[] = [];
  candidates: Candidate[] = [];
  projectId: any[];
  @Output() teamEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditTeamComponent>,
    private teamService: TeamService,
    private projectService: ProjectService,
    private sessionService: SessionService,
    private candidateService: CandidateService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Team
  ) {
    this.team = { ...data };
    this.projectId = []; 
  }

  ngOnInit() {
    this.teamForm = this.fb.group({
      name: [this.team.name, Validators.required],
      project: [this.team.projects ? this.team?.projects?.[0]?.id : null, Validators.required],
      candidates: [this.team.candidates ? this.team.candidates.map(candidate => candidate.id) : [], Validators.required],
      session: [this.team.session ? this.team.session.id : null, Validators.required],
    });

    this.getProjects();
    this.getSessions();
    this.getCandidates();
  }

  getnameErrorMessage(NameControl: any): string {
    if (NameControl?.hasError('required')) {
      return 'Name is required.';
    }
    return '';
  }


  getprojectErrorMessage(projectControl: any): string {
    if (projectControl?.hasError('required')) {
      return 'Project is required.';
    }
    return '';
  }

  getsessionErrorMessage(sessionControl: any): string {
    if (sessionControl?.hasError('required')) {
      return 'session is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  editTeam(): void {
    if (!this.team || !this.team.id) {
      console.error('Cannot edit team: Invalid team or ID is missing.');
      return;
    }

    if (this.teamForm.valid) {
      this.projectId.push(this.teamForm.value.project);
      const updatedTeam: Team = {
        name: this.teamForm.get('name')?.value,
        projects: this.projectId,
        session: this.teamForm.get('session')?.value, 
        candidates: this.teamForm.get('candidates')?.value, 
        isActive: this.team.isActive,
      };

      this.teamService.updateTeam(this.team.id, updatedTeam).subscribe(
        (updatedTeamResponse: Team) => {
          this.teamService.teamAdded.emit(updatedTeamResponse);
          this.teamEdited.emit(true);
          this.dialogRef.close(updatedTeamResponse);
        },
        (error: any) => {
          console.error('Failed to update team:', error);
          this.teamEdited.emit(false);
        }
      );
    }
  }
  
  
  getSessions(): void {
    this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
      this.sessions = sessions;
    });
  }

  getCandidates(): void {
    this.candidateService.getCandidatesWithTeams(1, 50, {}).subscribe((candidates: Candidate[]) => {
      this.candidates = candidates.filter(candidate => candidate.team === null || candidate.team?.id === this.team.id);
    });
  }
  

  getProjects(): void {
    this.projectService.getProjects(1, 50, {}).subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }
}