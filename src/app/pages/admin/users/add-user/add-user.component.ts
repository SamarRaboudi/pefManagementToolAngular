import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { Profil } from '../../../../../app/core/models/profil.model';
import { ProfilService } from '../../../../../app/core/services/profil.service'; 
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [MessageService]
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  profils: Profil[] = [];
  @Output() userAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private userService: UserService,
    private profilService: ProfilService ,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      prenom: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      profils: new FormControl([], Validators.required)
    });

    this.getProfils(); 
  }

  getprenomErrorMessage(firstNameControl: any): string {
    if (firstNameControl?.hasError('required')) {
      return 'Last Name is required.';
    }
    return '';
  }

  getnomErrorMessage(lastNameControl: any): string {
    if (lastNameControl?.hasError('required')) {
      return 'First Name is required.';
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

  getprofilErrorMessage(profilControl: any): string {
    if (profilControl?.hasError('required')) {
      return 'Profile is required.';
    }
    return '';
  }

  addUser(): void {
    if (this.userForm.valid) {
      const userData: User = {
        email: this.userForm.value.email,
        prenom: this.userForm.value.prenom,
        nom: this.userForm.value.nom,
        profils: this.userForm.value.profils
      };

      this.userService.addUser(userData).subscribe(
        (newUser: User) => {
          this.userService.userAdded.emit(newUser);
          this.userAdded.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add collaborator:', error);
          this.userAdded.emit(false);
        }
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getProfils(): void {
    this.profilService.getProfils(1, 50, {}).subscribe((profils: Profil[]) => {
      this.profils = profils;
    });
  }
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
}
showError() {
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message Content' });
}
}
