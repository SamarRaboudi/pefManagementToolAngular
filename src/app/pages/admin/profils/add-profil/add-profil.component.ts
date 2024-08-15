import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Profil } from 'src/app/core/models/profil.model';
import { ProfilService } from '../../../../core/services/profil.service';

@Component({
  selector: 'app-add-profil',
  templateUrl: './add-profil.component.html',
  styleUrls: ['./add-profil.component.scss']
})
export class AddProfilComponent implements OnInit{
  profilForm: FormGroup;
  @Output() profilAdded: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(public dialogRef: MatDialogRef<AddProfilComponent>,  private profilService: ProfilService) {}

  ngOnInit() {
    this.profilForm = new FormGroup({
      titre: new FormControl('', [Validators.required])
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
 
  addProfil(): void {
    if (this.profilForm.valid) {
      const titreControl = this.profilForm.get('titre');
      if (titreControl) {
        const profil: Profil = {
          titre: titreControl.value
        };
        this.profilService.addProfil(profil).subscribe(
          (newProfil: Profil) => {
            this.profilService.profilAdded.emit(newProfil);
            this.profilAdded.emit(true);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to add profile:', error);
            this.profilAdded.emit(false);
          }
        );
      }
    }
  }
  
  

}
