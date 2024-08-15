import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AddCampaignComponent } from './add-campaign.component';
import { MatDialogRef } from '@angular/material/dialog';
import { CampaignService } from '../../../../../app/core/services/campaign.service';
import { Campaign } from '../../../../../app/core/models/campaign.model';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddCampaignComponent', () => {
  let component: AddCampaignComponent;
  let fixture: ComponentFixture<AddCampaignComponent>;

  let matDialogRefMock: Partial<MatDialogRef<AddCampaignComponent>>;
  let campaignServiceMock: Partial<CampaignService>;
  let mockCampaign: Campaign;

  beforeEach(() => {
    mockCampaign = { id: 1, name: 'Test campaign' , startDate: new Date('2024-04-10'), endDate: new Date('2024-04-10')}; 

    matDialogRefMock = {
      close: jest.fn(), 
    };

    campaignServiceMock = {
      createCampaign: jest.fn(() => of(mockCampaign)), 
      campaignAdded: new EventEmitter<Campaign>(), 
    };

    TestBed.configureTestingModule({
      declarations: [AddCampaignComponent],
      imports: [HttpClientTestingModule], 
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CampaignService, useValue: campaignServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on closeDialog()', () => {
    component.closeDialog();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
  it('should update selected evaluators list on updateSelectedEvaluators()', () => {
    const evaluator: any = { id: 1, name: 'Evaluator', selected: true };

    component.evaluators = [evaluator];

    component.updateSelectedEvaluators();
  
    expect(component.selectedEvaluators.length).toBe(1);
    expect(component.selectedEvaluators[0]).toBe(evaluator);
  
    evaluator.selected = false;
    component.updateSelectedEvaluators();
  
    expect(component.selectedEvaluators.length).toBe(0);
  });
  
 
});
