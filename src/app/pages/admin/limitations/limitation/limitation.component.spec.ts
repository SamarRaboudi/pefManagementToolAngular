import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LimitationComponent } from './limitation.component';
import { MatDialog } from '@angular/material/dialog';
import { LimitationService } from '../../../../core/services/limitation.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

class MockLimitationService {
  getLimitations = jest.fn(() => of([]));
  limitationAdded = new EventEmitter<any>();
}

describe('LimitationComponent', () => {
  let component: LimitationComponent;
  let fixture: ComponentFixture<LimitationComponent>;
  let limitationServiceMock: MockLimitationService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    limitationServiceMock = new MockLimitationService(); 

    matDialogMock = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [ LimitationComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: LimitationService, useValue: limitationServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
