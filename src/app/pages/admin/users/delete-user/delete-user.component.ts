import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../../app/core/models/user.model';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
  user: User;
  @Output() userDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteUser(): void {
    if (!this.user || !this.user.id) {
      console.error('Cannot deactivate user: Invalid user or ID is missing.');
      return;
    }

    let payload: any = {
      nom: this.user.nom,
      prenom: this.user.prenom,
      email: this.user.email,
      roles: this.user.roles || [],
      isActive: false
    };

    if (Array.isArray(this.user.profils) && this.user.profils.length > 0) { 
      payload.profils = this.user.profils.map(profil => profil.id);
    }

    this.userService.updateUser(this.user.id, payload).subscribe(
      (updatedUser: User) => {
        this.userService.userAdded.emit(updatedUser);
        this.userDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update user:', error);
        this.userDeleted.emit(false);
      }
    );
  }
}
