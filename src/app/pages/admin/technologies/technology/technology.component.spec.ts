import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TechnologyService } from '../../../../core/services/technology.service';
import { TechnologyComponent } from './technology.component';
import { of } from 'rxjs';

// Define a mock technologyService
class MockTechnologyService {
  getTechnologies = jest.fn(() => of([])); // Provide a mock implementation for getTechnologies
  technologyAdded = new EventEmitter<any>();
}


describe('technologyComponent', () => {
  let component: TechnologyComponent;
  let fixture: ComponentFixture<TechnologyComponent>;
  let technologyServiceMock: MockTechnologyService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    technologyServiceMock = new MockTechnologyService(); 

    matDialogMock = {
      open: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TechnologyComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TechnologyService, useValue: technologyServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call gettechnologys on initialization', () => {
    expect(technologyServiceMock.getTechnologies).toHaveBeenCalled();
  });

  it('should handle technologyAdded event', () => {
    const newtechnology = { id: 1, label: 'Test technology', isActive: true };
    technologyServiceMock.technologyAdded.emit(newtechnology);
    expect(technologyServiceMock.getTechnologies).toHaveBeenCalled();
  });

 
});
