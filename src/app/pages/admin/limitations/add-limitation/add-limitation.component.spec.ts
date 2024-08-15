import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LimitationService, LimitationFilters } from '../../../../core/services/limitation.service';
import { AddLimitationComponent } from './add-limitation.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Limitation } from '../../../../../app/core/models/limitation.model';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

describe('AddLimitationComponent', () => {
  let component: AddLimitationComponent;
  let fixture: ComponentFixture<AddLimitationComponent>;
  let matDialogRefMock: Partial<MatDialogRef<AddLimitationComponent>>;
  let limitationServiceMock: Partial<LimitationService>;
  let mockLimitation: Limitation;

  beforeEach(async () => {
    mockLimitation = { id: 1, name: 'Test limitation' }; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    limitationServiceMock = {
      addLimitation: jest.fn(() => of(mockLimitation)), 
      limitationAdded: new EventEmitter<Limitation>(), 
    };
    await TestBed.configureTestingModule({
      declarations: [ AddLimitationComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LimitationService, useValue: limitationServiceMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
