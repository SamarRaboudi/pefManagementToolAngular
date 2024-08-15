import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignComponent } from './campaign.component';
import { MatDialog } from '@angular/material/dialog';
import { CampaignService } from '../../../../core/services/campaign.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

class MockCampaignService {
  getCampaigns = jest.fn(() => of([]));
  campaignAdded = new EventEmitter<any>();
}

describe('CampaignComponent', () => {
  let component: CampaignComponent;
  let fixture: ComponentFixture<CampaignComponent>;
  let campaignServiceMock: MockCampaignService; 
  let matDialogMock: Partial<MatDialog>;

  beforeEach(async () => {
    campaignServiceMock = new MockCampaignService(); 

    matDialogMock = {
      open: jest.fn(),
    };
    await TestBed.configureTestingModule({
      declarations: [ CampaignComponent ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientModule],
      providers: [
        { provide: CampaignService, useValue: campaignServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
