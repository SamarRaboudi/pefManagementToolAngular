import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationTeamComponent } from './evaluation-team.component';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { TeamService } from '../../../../core/services/team.service';
import { UserService } from '../../../../core/services/user.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EvaluationTeamComponent', () => {
  let component: EvaluationTeamComponent;
  let fixture: ComponentFixture<EvaluationTeamComponent>;

  // Mock services
  class MockCriteriaService {
    getCriterias = jest.fn(() => of([]));
  }
  
  class MockTeamService {

  }
  
  class MockUserService {
    getUsers = jest.fn(() => of([{ id: 1, email: 'test@example.com' }]));
  }
  
  class MockCampaignService {
    getTeamEvaluationData = jest.fn(() => of([{ teamData: {}, candidatesData: [] }]));
    updateEvaluationScoresAndGrades = jest.fn(() => of({}));
  }

  class MockMatDialog {
    open = jest.fn(() => ({
      afterClosed: () => of(true)
    }));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluationTeamComponent],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [
        { provide: CriteriaService, useClass: MockCriteriaService },
        { provide: TeamService, useClass: MockTeamService },
        { provide: UserService, useClass: MockUserService },
        { provide: CampaignService, useClass: MockCampaignService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ teamId: 1, campaignId: 1, isMyTeam: '0' })
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user and load evaluation criteria', () => {
    const userService = TestBed.inject(UserService);
    const criteriaService = TestBed.inject(CriteriaService);

    component.fetchUser();

    expect(userService.getUsers).toHaveBeenCalled();
    expect(criteriaService.getCriterias).toHaveBeenCalled();
  });

  it('should update criterion value and recalculate final note', () => {
    component.evaluationCriteria = [{ id: 1, name: 'Criterion 1', value: 1 }];
    component.candidateEvaluationData = [
      [{ candidate_id: 1, score: 0, criteria: { 1: 0 }, remark: '' }]
    ];

    component.updateCriterionValue({ candidate_id: 1, score: 0, criteria: { 1: 0 }, remark: '' }, 1, 5);

    expect(component.candidateEvaluationData[0][0].criteria[1]).toBe(5);
    expect(component.candidateEvaluationData[0][0].score).toBe(5);
  });

  it('should validate evaluation and open confirmation modal if all criteria are filled', () => {
    component.candidateEvaluationData = [
      [{ candidate_id: 1, score: 5, criteria: { 1: 5 }, remark: '' }]
    ];
    component.teamData = { teamName: 'Team A' };

    const snackBar = TestBed.inject(MatSnackBar);
    const dialog = TestBed.inject(MatDialog);

    jest.spyOn(snackBar, 'open');
    jest.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true)
    } as any);

    component.validateEvaluation();

    expect(snackBar.open).not.toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open success evaluation modal after successful confirmation', () => {
    const dialog = TestBed.inject(MatDialog);

    component.teamData = { teamName: 'Team A' };

    component.openSuccessEvaluationModal('Team A');

    expect(dialog.open).toHaveBeenCalled();
  });
});
