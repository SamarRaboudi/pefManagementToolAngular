import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../../../core/services/session.service';
import { Session } from '../../../../../app/core/models/session.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-session',
  templateUrl: './add-session.component.html',
  styleUrls: ['./add-session.component.scss'],
  providers: [MessageService]
})
export class AddSessionComponent implements OnInit{
  sessionForm: FormGroup;
  @Output() sessionAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(public dialogRef: MatDialogRef<AddSessionComponent>,  private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionForm = new FormGroup({
      name: new FormControl('', [Validators.required])
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
 
  addSession(): void {
    if (this.sessionForm.valid) {
      const nameControl = this.sessionForm.get('name');
      if (nameControl) {
        const session: Session = {
          name: nameControl.value
        };
        this.sessionService.addSession(session).subscribe(
          (newSession: Session) => {
            this.sessionService.sessionAdded.emit(newSession);
            this.sessionAdded.emit(true); 
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to add session:', error);
            this.sessionAdded.emit(false); 
          }
        );
      }
    }
  } 

}
