import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignService } from '../../../../core/services/campaign.service';
import { DeleteCampaignComponent } from './delete-campaign.component';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Campaign } from '../../../../../app/core/models/campaign.model';

describe('DeleteCampaignComponent', () => {
  let component: DeleteCampaignComponent;
  let fixture: ComponentFixture<DeleteCampaignComponent>;
  let matDialogRefMock: Partial<MatDialogRef<DeleteCampaignComponent>>;
  let campaignServiceMock: Partial<CampaignService>;
  let mockCampaign: Campaign;

  beforeEach(async () => {
    mockCampaign = { id: 1, name: 'Test campaign', isActive: true };

    matDialogRefMock = {
      close: jest.fn(),
    };

    campaignServiceMock = {
      updateCampaign: jest.fn(() => of(mockCampaign)),
      campaignAdded: new EventEmitter<Campaign>(),
    };

    await TestBed.configureTestingModule({
      declarations: [ DeleteCampaignComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockCampaign },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
