import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AddTechnologyComponent } from './add-technology.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TechnologyService } from '../../../../core/services/technology.service';
import { of } from 'rxjs';
import { Technology } from 'src/app/core/models/technology.model';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddTechnologyComponent', () => {
  let component: AddTechnologyComponent;
  let fixture: ComponentFixture<AddTechnologyComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddTechnologyComponent>>;
  let technologyServiceMock: Partial<TechnologyService>;
  let mockTechnology: Technology;

  beforeEach(() => {
    mockTechnology = { id: 1, label: 'Test technology' };

    matDialogRefMock = {
      close: jest.fn(),
    };

    technologyServiceMock = {
      addTechnology: jest.fn(() => of(mockTechnology)),
      technologyAdded: new EventEmitter<Technology>(),
    };

    TestBed.configureTestingModule({
      declarations: [AddTechnologyComponent],
      imports: [
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TechnologyService, useValue: technologyServiceMock },
        ToastrService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTechnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize technology form with empty label', () => {
    expect(component.technologyForm).toBeInstanceOf(FormGroup);
    expect(component.technologyForm.controls['label'].value).toEqual('');
  });

  it('should close dialog when closeDialog method is called', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

});
