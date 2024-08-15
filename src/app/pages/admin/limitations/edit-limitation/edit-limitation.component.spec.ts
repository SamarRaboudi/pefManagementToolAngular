import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditLimitationComponent } from './edit-limitation.component';
import { LimitationService } from '../../../../core/services/limitation.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Limitation } from '../../../../../app/core/models/limitation.model';
import { HttpClientModule } from '@angular/common/http';

describe('EditLimitationComponent', () => {
  let component: EditLimitationComponent;
  let fixture: ComponentFixture<EditLimitationComponent>;
  let matDialogRefMock: Partial<MatDialogRef<EditLimitationComponent>>;
  let limitationServiceMock: Partial<LimitationService>;
  let mockLimitation: Limitation;

  beforeEach(async () => {
    mockLimitation = { id: 1, name: 'Test Limitation', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    limitationServiceMock = {
      updateLimitation: jest.fn(() => of(mockLimitation)),
      limitationAdded: new EventEmitter<Limitation>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ EditLimitationComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LimitationService, useValue: limitationServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockLimitation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
