import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewInterviewComponent } from './view-interview.component';
import { InterviewService } from '../../../../../app/core/services/interview.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewInterviewComponent', () => {
  let component: ViewInterviewComponent;
  let fixture: ComponentFixture<ViewInterviewComponent>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let interviewServiceMock: Partial<ViewInterviewComponent>;
  let campaignServiceMock: Partial<CampaignService>;
  let criteriaServiceMock: Partial<CriteriaService>;

  beforeEach(async () => {
    activatedRouteMock = {
      params: of({ id: '1' }),
    };

    interviewServiceMock = {

    };

    campaignServiceMock = {

    };

    criteriaServiceMock = {
      getCriterias: jest.fn(() => of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewInterviewComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: InterviewService, useValue: interviewServiceMock },
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
