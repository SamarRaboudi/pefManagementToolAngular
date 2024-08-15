import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Team } from '../../../../core/models/team.model';
import { TeamService } from '../../../../core/services/team.service';
import { Project } from '../../../../../app/core/models/project.model';
import { ProjectService } from '../../../../../app/core/services/project.service'; 
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../../app/core/services/session.service';
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service'; 

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  teamForm: FormGroup;
  projects: Project[] = [];
  sessions: Session[] = [];
  candidates: Candidate[] = [];
  projectId: any[];
  @Output() teamAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddTeamComponent>,
    private teamService: TeamService,
    private projectService: ProjectService,
    private sessionService: SessionService,
    private candidateService: CandidateService,
  ) { this.projectId = []; }

  ngOnInit() {
    this.teamForm = new FormGroup({
      name: new FormControl('', Validators.required),
      project: new FormControl([], Validators.required),
      session: new FormControl('', Validators.required),
      candidates: new FormControl([], Validators.required) 

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

  addTeam(): void {
    this.projectId.push(this.teamForm.value.project);
    if (this.teamForm.valid) {
      const teamData: Team = {
        name: this.teamForm.value.name,
        projects: this.projectId,
        candidates: this.teamForm.value.candidates,
        session: this.teamForm.value.session,
      };
      this.teamService.addTeam(teamData).subscribe(
        (newTeam: Team) => {
          this.teamService.teamAdded.emit(newTeam);
          this.teamAdded.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add collaborator:', error);
          this.teamAdded.emit(false);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getProjects(): void {
    this.projectService.getProjects(1, 50, {}).subscribe((projects: Project[]) => {
      this.projects = projects;
    });
  }

  getCandidates(): void {
    this.candidateService.getCandidatesWithTeams(1, 50, {}).subscribe((candidates: Candidate[]) => {
      // Filter candidates where team is null
      this.candidates = candidates.filter(candidate => candidate.team === null);
    });
  }
  

  getSessions(): void {
    this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
      this.sessions = sessions;
    });
  }
}
