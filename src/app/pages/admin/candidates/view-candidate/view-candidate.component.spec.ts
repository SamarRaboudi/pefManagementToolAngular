import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewCandidateComponent } from './view-candidate.component';
import { CandidateService } from '../../../../../app/core/services/candidate.service';
import { CampaignService } from '../../../../core/services/campaign.service';
import { CriteriaService } from '../../../../core/services/criteria.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewCandidateComponent', () => {
  let component: ViewCandidateComponent;
  let fixture: ComponentFixture<ViewCandidateComponent>;
  let activatedRouteMock: Partial<ActivatedRoute>;
  let candidateServiceMock: Partial<CandidateService>;
  let campaignServiceMock: Partial<CampaignService>;
  let criteriaServiceMock: Partial<CriteriaService>;

  beforeEach(async () => {
    activatedRouteMock = {
      params: of({ id: '1' }),
    };

    candidateServiceMock = {
      getCandidateById: jest.fn(() => of({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        picture: '',
        skills: ['Skill 1', 'Skill 2'],
        isActive: true,
        team: {
          projects: [
            {
              title: 'Project Title',
              supervisor: [{ nom: 'Supervisor', prenom: 'Supervisor' }]
            }
          ],
          name: 'Team Name',
          candidates: [{}, {}, {}]
        }
      })),
      updateCandidate: jest.fn((id, candidate) => of(candidate)),
    };

    campaignServiceMock = {
      getCandidateAllEvaluationData: jest.fn(() => of([])),
    };

    criteriaServiceMock = {
      getCriterias: jest.fn(() => of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [ViewCandidateComponent],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CandidateService, useValue: candidateServiceMock },
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: CriteriaService, useValue: criteriaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch candidate data on initialization', () => {
    expect(candidateServiceMock.getCandidateById).toHaveBeenCalledWith(1);
    expect(component.candidate).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      picture: '',
      skills: ['Skill 1', 'Skill 2'],
      isActive: true,
      team: {
        projects: [
          {
            title: 'Project Title',
            supervisor: [{ nom: 'Supervisor', prenom: 'Supervisor' }]
          }
        ],
        name: 'Team Name',
        candidates: [{}, {}, {}]
      }
    });
  });

  it('should initialize form controls', () => {
    expect(component.candidateForm).toBeTruthy();
    expect(component.candidateForm.get('firstName')).toBeTruthy();
    expect(component.candidateForm.get('lastName')).toBeTruthy();
    expect(component.candidateForm.get('email')).toBeTruthy();
    expect(component.candidateForm.get('skills')).toBeTruthy();
  });

  it('should toggle skill input correctly', () => {
    component.showSkillInput = false;
    component.toggleSkillInput();
    expect(component.showSkillInput).toBe(true);

    component.toggleSkillInput();
    expect(component.showSkillInput).toBe(false);
  });

  it('should add skill correctly', () => {
    component.newSkill = 'New Skill';
    component.candidate = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', picture: '', skills: [], isActive: true };

    component.addSkill();

    expect(component.candidate.skills).toEqual(['New Skill']);
  });

  it('should show and hide delete button correctly', () => {
    component.showDeleteButton('Skill 1');
    expect(component.hoveredSkill).toBe('Skill 1');

    component.hideDeleteButton('Skill 1');
    expect(component.hoveredSkill).toBe(null);
  });

  it('should check if skill is hovered correctly', () => {
    component.hoveredSkill = 'Skill 1';
    expect(component.isHovered('Skill 1')).toBe(true);
    expect(component.isHovered('Skill 2')).toBe(false);
  });

  it('should delete skill correctly', () => {
    component.candidate = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', picture: '', skills: ['Skill 1', 'Skill 2'], isActive: true };

    component.deleteSkill('Skill 1');

    expect(component.candidate.skills).toEqual(['Skill 2']);
  });

  it('should cancel add skill correctly', () => {
    component.newSkill = 'New Skill';
    component.showSkillInput = true;

    component.cancelAddSkill();

    expect(component.newSkill).toBe('');
    expect(component.showSkillInput).toBe(false);
  });
});
