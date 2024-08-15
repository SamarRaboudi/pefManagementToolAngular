import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Criteria } from '../../../../../app/core/models/criteria.model';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { ProfilService } from '../../../../core/services/profil.service';
import { Profil } from '../../../../../app/core/models/profil.model';

@Component({
  selector: 'app-edit-criteria',
  templateUrl: './edit-criteria.component.html',
  styleUrls: ['./edit-criteria.component.scss']
})
export class EditCriteriaComponent implements OnInit {
  criteriaForm: FormGroup;
  criteria: Criteria;
  criteriaId: number;
  profils: Profil[] = [];
  @Output() criteriaEdited: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<EditCriteriaComponent>,
    private criteriaService: CriteriaService,
    private profilService: ProfilService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Criteria
  ) {
    this.criteria = { ...data };
  }

  ngOnInit() {
    this.criteriaForm = this.fb.group({
      name: [this.criteria.name, Validators.required],
      value: [this.criteria.value, Validators.required],
      profils: [this.criteria.profils ? this.criteria.profils.map(profil => profil.id) : [],],
    });

    this.getProfils();
  }

  getnameErrorMessage(NameControl: any): string {
    if (NameControl?.hasError('required')) {
      return 'Name is required.';
    }
    return '';
  }
  getvalueErrorMessage(ValueControl: any): string {
    if (ValueControl?.hasError('required')) {
      return 'Value is required.';
    }
    return '';
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  editCriteria(): void {
    if (!this.criteriaForm || !this.criteria || !this.criteria.id) {
      console.error('Criteria form is not initialized or invalid criteria data.');
      return;
    }
  
    if (this.criteriaForm.valid) {
      const { name, value, profils } = this.criteriaForm.value;
      const payload = {
        name,
        value,
        profils, 
        isActive: true
      };
  
      this.criteriaService.updateCriteria(this.criteria.id, payload).subscribe(
        (updatedCriteria: Criteria) => {
          this.criteriaService.criteriaAdded.emit(updatedCriteria);
          this.criteriaEdited.emit(true);
          this.closeDialog();
        },
        (error) => {
          console.error('Failed to update criteria:', error);
          this.criteriaEdited.emit(false);
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
