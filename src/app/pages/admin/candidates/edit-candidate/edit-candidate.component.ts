import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Candidate } from '../../../../../app/core/models/candidate.model';
import { CandidateService } from '../../../../../app/core/services/candidate.service';

@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss']
})
export class EditCandidateComponent implements OnInit{
  candidateForm: FormGroup;
  photoLink: any; 
  candidate: Candidate;
  candidateId:number;
  @Output() candidateEdited: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(public dialogRef: MatDialogRef<EditCandidateComponent>,  
              private candidateService: CandidateService,
              @Inject(MAT_DIALOG_DATA) public data: Candidate 
              ) {
                this.candidate = { ...data }; 
                this.photoLink = this.candidate.picture;
              }

  ngOnInit() {
    this.candidateForm = new FormGroup({
      firstName: new FormControl(this.candidate.firstName, [Validators.required]),
      lastName: new FormControl(this.candidate.lastName, [Validators.required]),
      email: new FormControl(this.candidate.email, [Validators.required, Validators.email]),
      picture: new FormControl(null) ,
    });
  }
  getFirstNameErrorMessage(firstNameControl: any): string {
    if (firstNameControl?.hasError('required')) {
      return 'FirstName is required.';
    }
    return '';
  }

  getLastNameErrorMessage(lastNameControl: any): string {
    if (lastNameControl?.hasError('required')) {
      return 'LastName is required.';
    }
    return '';
  }

  getEmailErrorMessage(emailControl: any): string {
    if (emailControl?.hasError('required')) {
      return 'Email is required.';
    }

    if (emailControl?.hasError('email')) {
      return 'Email must be valid.';
    }

    return '';
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  onFileChanged(event: any) {
    const file = event.target.files[0];
    this.candidateForm.patchValue({
      picture: file
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.photoLink = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  editCandidate(): void {
    if (!this.candidate || !this.candidate.id) {
      console.error('Cannot edit candidate: Invalid candidate or ID is missing.');
      return;
    }
    
    if (this.candidateForm.valid) {
      const firstNameControl = this.candidateForm.get('firstName');
      const lastNameControl = this.candidateForm.get('lastName');
      const emailControl = this.candidateForm.get('email');
      if (firstNameControl && lastNameControl && emailControl) {
        const candidate: Candidate = {
          firstName: firstNameControl.value,
          lastName: lastNameControl.value,
          email: emailControl.value,
          isActive: true
        };
        this.candidateId = this.candidate.id;
        // Check if a new file is selected
        if (this.candidateForm.get('picture')?.value instanceof File) {
          const file = this.candidateForm.get('picture')?.value;
          this.candidateService.uploadCandidatePicture(this.candidateId, file).subscribe(
            (pictureUrl: string) => {
              candidate.picture = pictureUrl; 
              this.updateCandidateWithPicture(candidate);
            },
            (error) => {
              console.error('Failed to upload picture:', error);
            }
          );
        } else {
          // If no new file is selected, update technology without changing the logo
          this.updateCandidateWithPicture(candidate);
        }
      }
    }
  }
  
  private updateCandidateWithPicture(candidate: Candidate): void {
    this.candidateService.updateCandidate(this.candidateId, candidate).subscribe(
      (updateCandidate: Candidate) => {
        this.candidateService.candidateAdded.emit(updateCandidate);
        this.candidateEdited.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update candidate:', error);
        this.candidateEdited.emit(false);
      }
    );
  }
  
  

}

