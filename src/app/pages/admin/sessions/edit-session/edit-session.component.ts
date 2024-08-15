import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Session } from '../../../../../app/core/models/session.model';
import { SessionService } from '../../../../core/services/session.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit{
  sessionForm: FormGroup;
  session: Session;
  sessionId:number;
  @Output() sessionEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<EditSessionComponent>,  
              private sessionService: SessionService,
              @Inject(MAT_DIALOG_DATA) public data: Session 
              ) {
                this.session = { ...data }; 
              }

  ngOnInit() {
    this.sessionForm = new FormGroup({
      name: new FormControl(this.session.name, [Validators.required]) 
    });
  }
  getNameErrorMessage(nameControl: any): string {
    if (nameControl?.hasError('required')) {
      return 'Session\'s name is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 
  editSession(): void {
    if (!this.session || !this.session.id) {
      console.error('Cannot edit session: Invalid session or ID is missing.');
      return;
    }
    
    if (this.sessionForm.valid) {
      const nameControl = this.sessionForm.get('name');
      if (nameControl) {
        const session: Session = {
          name: nameControl.value,
          isActive: true
        };
        this.sessionId = this.session.id;
        this.sessionService.updateSession(this.sessionId, session).subscribe(
          (updatedSession: Session) => {
            this.sessionService.sessionAdded.emit(updatedSession);
            this.sessionEdited.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to update session:', error);
            this.sessionEdited.emit(false);
          }
        );
      }
    }
  }
  
  
  

}

