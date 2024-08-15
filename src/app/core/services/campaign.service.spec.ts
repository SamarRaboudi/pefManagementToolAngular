import { TestBed } from '@angular/core/testing';

import { CampaignFilters, CampaignService } from './campaign.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Campaign } from '../models/campaign.model';

describe('CampaignService', () => {
  let service: CampaignService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CampaignService]
    });

    service = TestBed.inject(CampaignService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch campaigns', () => {
    const dummycampaigns: Campaign[] = [{ id: 1, name: 'campaign 1' }, { id: 2, name: 'campaign 2' }];

    const page = 1;
    const limit = 10;
    const filters: CampaignFilters = { isActive: true };

    service.getCampaigns(page, limit, filters).subscribe((campaigns: Campaign[]) => {
      expect(campaigns.length).toBe(2);
      expect(campaigns).toEqual(dummycampaigns);
    });

    const req = httpTestingController.expectOne('campaign?page=1&limit=10&isActive=true');
    expect(req.request.method).toBe('GET');

    req.flush(dummycampaigns);
  });

  it('should add a campaign', () => {
    const newcampaign: Campaign = { id: 3, name: 'New campaign' };

    service.createCampaign(newcampaign).subscribe((campaign: Campaign) => {
      expect(campaign).toEqual(newcampaign);
    });

    const req = httpTestingController.expectOne('campaign');
    expect(req.request.method).toBe('POST');
    req.flush(newcampaign);
  });

  it('should update a campaign', () => {
    const updatedcampaign: Campaign = { id: 2, name: 'Updated campaign' };

    service.updateCampaign(2, updatedcampaign).subscribe((campaign: Campaign) => {
      expect(campaign).toEqual(updatedcampaign);
    });

    const req = httpTestingController.expectOne('campaign/2');
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedcampaign);
  });

});
