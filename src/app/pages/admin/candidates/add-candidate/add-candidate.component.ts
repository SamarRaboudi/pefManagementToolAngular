import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Candidate } from '../../../../core/models/candidate.model';
import { CandidateService } from '../../../../core/services/candidate.service';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit{
  candidateForm: FormGroup;
  photoLink ="";
  @Output() candidateAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<AddCandidateComponent>,  private candidateService: CandidateService) {}

  ngOnInit() {
    this.candidateForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      picture: new FormControl(null)
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


  addCandidate(): void {
    if (this.candidateForm.valid) {
      const firstNameControl = this.candidateForm.get('firstName');
      const lastNameControl = this.candidateForm.get('lastName');
      const emailControl = this.candidateForm.get('email');
      const pictureControl = this.candidateForm.get('picture');
      if (firstNameControl && lastNameControl && emailControl && pictureControl) {
        const formData = new FormData();
        formData.append('firstName', firstNameControl.value);
        formData.append('lastName', lastNameControl.value);
        formData.append('email', emailControl.value);
        formData.append('picture', pictureControl.value);
        this.candidateService.addCandidate(formData).subscribe(
          (newCandidate: Candidate) => {
            this.candidateService.candidateAdded.emit(newCandidate);
            this.candidateAdded.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to add candidate:', error);
            this.candidateAdded.emit(false);
          }
        );
      }
    }
  } 

}
