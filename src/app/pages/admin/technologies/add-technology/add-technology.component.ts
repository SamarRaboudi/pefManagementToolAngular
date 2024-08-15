import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Technology } from 'src/app/core/models/technology.model';
import { TechnologyService } from '../../../../core/services/technology.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-technology',
  templateUrl: './add-technology.component.html',
  styleUrls: ['./add-technology.component.scss'],
  providers: [MessageService]
})
export class AddTechnologyComponent implements OnInit{
  technologyForm: FormGroup;
  photoLink ="";
  @Output() technologyAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialogRef: MatDialogRef<AddTechnologyComponent>,  private technologyService: TechnologyService,  private messageService: MessageService) {}

  ngOnInit() {
    this.technologyForm = new FormGroup({
      label: new FormControl('', [Validators.required]),
      logo: new FormControl(null)
    });
  }

  getLabelErrorMessage(labelControl: any): string {
    if (labelControl?.hasError('required')) {
      return 'Technology\'s label is required.';
    }
    return '';
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  onFileChanged(event: any) {
    const file = event.target.files[0];
    this.technologyForm.patchValue({
      logo: file
    });

    const reader = new FileReader();
    reader.onload = () => {
      this.photoLink = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  addTechnology(): void {
    if (this.technologyForm.valid) {
      const labelControl = this.technologyForm.get('label');
      const logoControl = this.technologyForm.get('logo');
      if (labelControl && logoControl) {
        const formData = new FormData();
        formData.append('label', labelControl.value);
        formData.append('logo', logoControl.value);

        this.technologyService.addTechnology(formData).subscribe(
          (newTechnology: Technology) => {
            this.technologyAdded.emit(true);
            this.technologyService.technologyAdded.emit(newTechnology);
            this.closeDialog();
          },
          (error) => {
            console.error('Failed to add technology:', error);
            this.technologyAdded.emit(false); 
          }
        );
      }
    }
  }

 

}
