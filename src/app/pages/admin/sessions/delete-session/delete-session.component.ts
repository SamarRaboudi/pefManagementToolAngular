import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-delete-session',
  templateUrl: './delete-session.component.html',
  styleUrls: ['./delete-session.component.scss']
})
export class DeleteSessionComponent {
  session: Session;
  sessionId: number;
  @Output() sessionDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<DeleteSessionComponent>,  
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: Session 
    ) {
      this.session = { ...data }; 
    }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteSession(): void {
    if (!this.session || !this.session.id) {
      console.error('Cannot delete session: Invalid session or ID is missing.');
      return;
    }
        const session: Session = {
          name: this.session.name,
          isActive: false
        };
        this.sessionId = this.session.id;
        this.sessionService.updateSession(this.sessionId, session).subscribe(
          (updatedSession: Session) => {
            this.sessionService.sessionAdded.emit(updatedSession);
            this.sessionDeleted.emit(true); 
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to update profile:', error);
            this.sessionDeleted.emit(false); 
          }
        );
      
        }
}
