import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EvaluationTeamDetailsComponent } from './evaluation-team-details.component';
import { ActivatedRoute } from '@angular/router';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Criteria } from '../../../../core/models/criteria.model';

describe('EvaluationTeamDetailsComponent', () => {
  let component: EvaluationTeamDetailsComponent;
  let fixture: ComponentFixture<EvaluationTeamDetailsComponent>;
  let criteriaServiceMock: any;
  let campaignServiceMock: any;
  let activatedRouteMock: any;
  const mockCriteria: Criteria[] = [{ id: 1, name: 'Criteria 1' }, { id: 2, name: 'Criteria 2' }];
  const mockTeamData = [[{ name: 'Campaign 1', startDate: '2023-01-01', endDate: '2023-12-31', evaluations: [] }]];

  beforeEach(() => {
    criteriaServiceMock = {
      getCriterias: jest.fn(() => of(mockCriteria)),
    };

    campaignServiceMock = {
      getTeamAllEvaluationData: jest.fn(() => of(mockTeamData)),
    };

    activatedRouteMock = {
      params: of({ teamId: 1 })
    };

    TestBed.configureTestingModule({
      declarations: [EvaluationTeamDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule],
      providers: [
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluationTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and set evaluation criteria on initialization', () => {
    expect(criteriaServiceMock.getCriterias).toHaveBeenCalled();
    expect(component.evaluationCriteria).toEqual(mockCriteria);
    expect(component.columnsToDisplay).toEqual(['Evaluator', 'Criteria 1', 'Criteria 2', 'Final Note']);
  });

  it('should fetch and set team evaluation data on initialization', () => {
    expect(campaignServiceMock.getTeamAllEvaluationData).toHaveBeenCalledWith(1);
    expect(component.teamData).toEqual(mockTeamData);
    expect(component.loading).toBe(false);
  });

  it('should toggle row expansion', () => {
    component.toggleRowExpansion(1);
    expect(component.expandedRowIndices).toContain(1);

    component.toggleRowExpansion(1);
    expect(component.expandedRowIndices).not.toContain(1);
  });

  it('should check if a row is expanded', () => {
    component.toggleRowExpansion(1);
    expect(component.isRowExpanded(1)).toBe(true);
    expect(component.isRowExpanded(2)).toBe(false);
  });

  it('should check if a campaign is finished', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    expect(component.isCampaignFinished(pastDate.toISOString())).toBe(true);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    expect(component.isCampaignFinished(futureDate.toISOString())).toBe(false);
  });

  it('should check if a campaign is in progress', () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    expect(component.isCampaignInProgress(startDate.toISOString(), endDate.toISOString())).toBe(true);

    const pastEndDate = new Date();
    pastEndDate.setDate(pastEndDate.getDate() - 1);
    expect(component.isCampaignInProgress(startDate.toISOString(), pastEndDate.toISOString())).toBe(false);
  });

  it('should check if a campaign is not started yet', () => {
    const futureStartDate = new Date();
    futureStartDate.setDate(futureStartDate.getDate() + 1);
    expect(component.isCampaignNotStartedYet(futureStartDate.toISOString())).toBe(true);

    const pastStartDate = new Date();
    pastStartDate.setDate(pastStartDate.getDate() - 1);
    expect(component.isCampaignNotStartedYet(pastStartDate.toISOString())).toBe(false);
  });
});
