import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfilService } from '../../../../core/services/profil.service';
import { Profil } from '../../../../../app/core/models/profil.model';

@Component({
  selector: 'app-delete-profil',
  templateUrl: './delete-profil.component.html',
  styleUrls: ['./delete-profil.component.scss']
})
export class DeleteProfilComponent {
  profil: Profil;
  profilId: number;
  @Output() profilDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<DeleteProfilComponent>,  
    private profilService: ProfilService,
    @Inject(MAT_DIALOG_DATA) public data: Profil 
    ) {
      this.profil = { ...data }; 
    }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteProfil(): void {
    if (!this.profil || !this.profil.id) {
      console.error('Cannot delete profile: Invalid profil or ID is missing.');
      return;
    }
        const profil: Profil = {
          titre: this.profil.titre,
          isActive: false
        };
        this.profilId = this.profil.id;
        this.profilService.updateProfil(this.profilId, profil).subscribe(
          (updatedProfil: Profil) => {
            this.profilService.profilAdded.emit(updatedProfil);
            this.profilDeleted.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to update profile:', error);
            this.profilDeleted.emit(false);
          }
        );
      
        }
}
