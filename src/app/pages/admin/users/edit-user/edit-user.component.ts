import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../app/core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { Profil } from '../../../../../app/core/models/profil.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  userId: number;
  profils: Profil[] = [];
  roles: string[] = ['ROLE_USER'];
  @Output() userEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private userService: UserService,
    private profilService: ProfilService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { ...data };
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      nom: [this.user.nom, Validators.required],
      prenom: [this.user.prenom, Validators.required],
      email: [this.user.email, Validators.required],
      profils: [this.user.profils ? this.user.profils.map(profil => profil.id) : [], Validators.required],
    });

    this.getProfils();
  }

  getprenomErrorMessage(firstNameControl: any): string {
    if (firstNameControl?.hasError('required')) {
      return 'First Name is required.';
    }
    return '';
  }

  getnomErrorMessage(lastNameControl: any): string {
    if (lastNameControl?.hasError('required')) {
      return 'Last Name is required.';
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  editUser(): void {
    if (!this.userForm || !this.user || !this.user.id) {
      console.error('User form is not initialized or invalid user data.');
      return;
    }
  
    if (this.userForm.valid) {
      const { prenom, nom, email, profils } = this.userForm.value;
      const payload = {
        prenom,
        nom,
        email,
        profils, 
        roles: ['ROLE_USER'],
        isActive: true
      };
  
      this.userService.updateUser(this.user.id, payload).subscribe(
        (updatedUser: User) => {
          this.userService.userAdded.emit(updatedUser);
          this.userEdited.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to update user:', error);
          this.userEdited.emit(false);
        }
      );
    }
  }
  

  getProfils(): void {
    this.profilService.getProfils(1, 50, {}).subscribe((profils: Profil[]) => {
      this.profils = profils;
    });
  }
}
