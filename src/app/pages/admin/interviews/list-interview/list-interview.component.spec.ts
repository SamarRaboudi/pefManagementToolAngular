import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListInterviewComponent } from './list-interview.component';
import { ActivatedRoute } from '@angular/router';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Criteria } from '../../../../core/models/criteria.model';

describe('ListInterviewComponent', () => {
  let component: ListInterviewComponent;
  let fixture: ComponentFixture<ListInterviewComponent>;
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
      declarations: [ListInterviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule, BrowserAnimationsModule],
      providers: [
        { provide: CriteriaService, useValue: criteriaServiceMock },
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
