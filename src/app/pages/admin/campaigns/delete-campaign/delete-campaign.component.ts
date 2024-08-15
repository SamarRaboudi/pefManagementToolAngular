import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CampaignService } from '../../../../core/services/campaign.service';
import { Campaign } from '../../../../../app/core/models/campaign.model';

@Component({
  selector: 'app-delete-campaign',
  templateUrl: './delete-campaign.component.html',
  styleUrls: ['./delete-campaign.component.scss']
})
export class DeleteCampaignComponent {
  campaign: Campaign;
  @Output() campaignDeleted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public dialogRef: MatDialogRef<DeleteCampaignComponent>,
    private campaignService: CampaignService,
    @Inject(MAT_DIALOG_DATA) public data: Campaign
  ) {
    this.campaign = { ...data };
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteCampaign(): void {
    if (!this.campaign || !this.campaign.id) {
      console.error('Cannot deactivate campaign: Invalid campaign or ID is missing.');
      return;
    }

    let payload: any = {
      name: this.campaign.name,
      startDate: this.campaign.startDate,
      endDate: this.campaign.endDate,
      isActive: false,
      isValid: this.campaign.isValid,
      evaluators: this.campaign.evaluators,
    }
    if (this.campaign.session && typeof this.campaign.session === 'object' && this.campaign.session.id) {
      payload.session = this.campaign.session.id;
  }
  

    this.campaignService.updateCampaign(this.campaign.id, payload).subscribe(
      (updatedCampaign: Campaign) => {
        this.campaignService.campaignAdded.emit(updatedCampaign);
        this.campaignDeleted.emit(true);
        this.closeDialog();
      },
      (error) => {
        console.error('Failed to update campaign:', error);
        this.campaignDeleted.emit(false);
      }
    );
  }
}
