import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { Profil } from '../../../../../app/core/models/profil.model';
import { ProfilService } from '../../../../../app/core/services/profil.service'; 

@Component({
  selector: 'app-add-criteria',
  templateUrl: './add-criteria.component.html',
  styleUrls: ['./add-criteria.component.scss']
})
export class AddCriteriaComponent implements OnInit {
  criteriaForm: FormGroup;
  profils: Profil[] = [];
  @Output() criteriaAdded: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    public dialogRef: MatDialogRef<AddCriteriaComponent>,
    private criteriaService: CriteriaService,
    private profilService: ProfilService // Inject ProfilService
  ) { }

  ngOnInit() {
    this.criteriaForm = new FormGroup({
      name: new FormControl('', Validators.required),
      value: new FormControl(1, Validators.required),
      profils: new FormControl([],)
    });

    this.getProfils(); 
  }


  getnameErrorMessage(lastNameControl: any): string {
    if (lastNameControl?.hasError('required')) {
      return 'Name is required.';
    }
    return '';
  }
  getvalueErrorMessage(lastNameControl: any): string {
    if (lastNameControl?.hasError('required')) {
      return 'Value is required.';
    }
    return '';
  }

  addCriteria(): void {
    if (this.criteriaForm.valid) {
      const criteriaData: Criteria = {
        name: this.criteriaForm.value.name,
        value: this.criteriaForm.value.value,
        profils: this.criteriaForm.value.profils
      };

      this.criteriaService.addCriteria(criteriaData).subscribe(
        (newCriteria: Criteria) => {
          this.criteriaService.criteriaAdded.emit(newCriteria);
          this.criteriaAdded.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to add Criteria:', error);
          this.criteriaAdded.emit(false);
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
}
