import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Profil } from '../../../../../app/core/models/profil.model';
import { ProfilService } from '../../../../core/services/profil.service';

@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.scss']
})
export class EditProfilComponent implements OnInit{
  profilForm: FormGroup;
  profil: Profil;
  profilId:number;
  @Output() profilEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<EditProfilComponent>,  
              private profilService: ProfilService,
              @Inject(MAT_DIALOG_DATA) public data: Profil 
              ) {
                this.profil = { ...data }; 
              }

  ngOnInit() {
    this.profilForm = new FormGroup({
      titre: new FormControl(this.profil.titre, [Validators.required]) 
    });
  }
  getTitreErrorMessage(titreControl: any): string {
    if (titreControl?.hasError('required')) {
      return 'Profile\'s title is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
 
  editProfil(): void {
    if (!this.profil || !this.profil.id) {
      console.error('Cannot edit profil: Invalid profil or ID is missing.');
      return;
    }
    
    if (this.profilForm.valid) {
      const titreControl = this.profilForm.get('titre');
      if (titreControl) {
        const profil: Profil = {
          titre: titreControl.value,
          isActive: true
        };
        this.profilId = this.profil.id;
        this.profilService.updateProfil(this.profilId, profil).subscribe(
          (updatedProfil: Profil) => {
            this.profilService.profilAdded.emit(updatedProfil);
            this.profilEdited.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to update profile:', error);
            this.profilEdited.emit(false);
          }
        );
      }
    }
  }
  
  
  

}
