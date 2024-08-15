import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationInterviewComponent } from './evaluation-interview.component';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { UserService } from '../../../../core/services/user.service';
import { InterviewService } from '../../../../core/services/interview.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EvaluationInterviewComponent', () => {
  let component: EvaluationInterviewComponent;
  let fixture: ComponentFixture<EvaluationInterviewComponent>;

  // Mock services
  class MockCriteriaService {
    getCriterias = jest.fn(() => of([]));
  }
  
  class MockUserService {
    getUsers = jest.fn(() => of([{ id: 1, email: 'test@example.com' }]));
  }
  
  class MockInterviewService {
    getInterviewData = jest.fn(() => of([{ id: 1, candidatesData: [] }]));
    updateInterviewScoresAndGrades = jest.fn(() => of({}));
  }

  class MockMatDialog {
    open = jest.fn(() => ({
      afterClosed: () => of(true)
    }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationInterviewComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: CriteriaService, useClass: MockCriteriaService },
        { provide: UserService, useClass: MockUserService },
        { provide: InterviewService, useClass: MockInterviewService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update criterion value', () => {
    const candidateData = { candidate_id: 1, remark: '', criteria: { 1: 'Good' } };
    component.candidateInterviewData = [[candidateData]];
    component.updateCriterionValue(candidateData, 1, 'Excellent');
    expect(component.candidateInterviewData[0][0].criteria[1]).toEqual('Excellent');
  });

  it('should generate empty criteria object', () => {
    component.evaluationCriteria = [{ id: 1, name: 'Communication' }, { id: 2, name: 'Technical Skills' }];
    const emptyCriteriaObject = component.generateEmptyCriteriaObject();
    expect(Object.keys(emptyCriteriaObject).length).toEqual(2);
    expect(emptyCriteriaObject[1]).toBeNull();
    expect(emptyCriteriaObject[2]).toBeNull();
  });
  
});
