import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Campaign } from '../../../../../app/core/models/campaign.model';
import { Session } from '../../../../../app/core/models/session.model';
import { User } from '../../../../../app/core/models/user.model';
import { CampaignService } from '../../../../../app/core/services/campaign.service';
import { SessionService } from '../../../../../app/core/services/session.service';
import { UserFilters, UserService } from '../../../../../app/core/services/user.service';
import { AvailabilityDialogComponent } from '../availability-dialog/availability-dialog.component';

interface EvaluatedUser extends User {
  selected: boolean;
  availableDays?: Array<{ date: Date, timeRanges: Array<{ startTime: string, endTime: string }> }>;
}

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent implements OnInit {

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };
  days: string[] = [];
  sessions: Session[] = [];
  evaluators: EvaluatedUser[] = [];
  selectedEvaluators: EvaluatedUser[] = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  isEditable = false;
  isDateRangeValid = true;
  isLinear = false;
  sessionId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddCampaignComponent>,
    private _formBuilder: FormBuilder,
    private sessionService: SessionService,
    private userService: UserService,
    private campaignService: CampaignService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.firstFormGroup = this._formBuilder.group({
      sessionName: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      selectedEvaluators: [[]],
    });
    this.thirdFormGroup = this._formBuilder.group({
      startDate: ['', [Validators.required, this.dateValidator]],
      endDate: ['', Validators.required],
    });
  }
  
  ngOnInit(): void {
    this.getSessions();
    this.getEvaluators();
    setTimeout(() => {
      // Move these updates inside a setTimeout
      this.updateSelectedEvaluators();
      this.validateDateRange();
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

  getSessions(): void {
    this.sessionService.getSessions(1, 50, {}).subscribe((sessions: Session[]) => {
      this.sessions = sessions;
    });
  }

  getEvaluators(): void {
    const evaluatorFilter: UserFilters = {
      searchQuery: 'Evaluator'
    };
    this.userService.getUsers(1, 50, evaluatorFilter).subscribe((evaluators: User[]) => {
      this.evaluators = evaluators.map(evaluator => ({ ...evaluator, selected: false }));
    });
  }

  updateSelectedEvaluators(): void {
    this.selectedEvaluators = this.evaluators.filter(evaluator => evaluator.selected);
  }
  
  selectAllEvaluators(checked: boolean): void {
    this.evaluators.forEach(evaluator => evaluator.selected = checked);
    this.updateSelectedEvaluators();
  }
  
  updateEvaluatorSelection(checked: boolean, evaluator: EvaluatedUser): void {
    evaluator.selected = checked;
    this.updateSelectedEvaluators();
  }
  
  startDateChange(event: MatDatepickerInputEvent<Date>) {
    this.validateDateRange();
  }

  endDateChange(event: MatDatepickerInputEvent<Date>) {
    this.validateDateRange();
  }

  validateDateRange(): void {
    const startDate = this.thirdFormGroup.get('startDate')?.value;
    const endDate = this.thirdFormGroup.get('endDate')?.value;

    if (startDate && endDate) {
      const startDay = startDate.getDay();
      const endDay = endDate.getDay();

      this.isDateRangeValid = startDay !== 0 && startDay !== 6 && endDay !== 0 && endDay !== 6;
    }
  }

  dateValidator(control: any): { [key: string]: any } | null {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    return selectedDate < today ? { 'invalidDate': true } : null;
  }

  createCampaign(): void {
    if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid) {
      const startDate = this.thirdFormGroup.value.startDate;
      const endDate = this.thirdFormGroup.value.endDate;
  
      const selectedSession = this.sessions.find(session => session.name === this.firstFormGroup.value.sessionName);
  
      if (selectedSession) {
        const evaluatorIds = this.selectedEvaluators.map(evaluator => evaluator.id);
  
        const availabilityData: any[] = [];
  
        // Iterate over each day displayed in the table
        this.days.forEach(day => {
          console.log("day",day);
          this.selectedEvaluators.forEach(evaluator => {
            console.log("evaluator",evaluator);
            console.log("evaluator",evaluator.availableDays);
            const availability = evaluator.availableDays?.find(availDay =>
              availDay.date.toDateString() === new Date(day).toDateString()
            );
            console.log("availability",availability);
            if (availability && availability.timeRanges.length > 0) {
              // Construct availability object for each time range
              availability.timeRanges.forEach(timeRange => {
                availabilityData.push({
                  evaluator_id: evaluator.id,
                  available_day: [this.formatDate(availability.date)],
                  time_ranges: [{
                    start_time: timeRange.startTime,
                    end_time: timeRange.endTime
                  }]
                });
              });
            }
          });
        });
  
        const campaignData = {
          name: 'Campaign',
          session: selectedSession.id,
          startDate: startDate,
          endDate: endDate,
          isActive: true,
          isValid: false,
          evaluators: evaluatorIds,
          availability: availabilityData
        };
  
        console.log("Campaign data with availability:", campaignData);
        this.campaignService.createCampaign(campaignData as Campaign).subscribe(
          (newCampaign: Campaign) => {
            this.campaignService.campaignAdded.emit(newCampaign);
            this.closeDialog();
            this.router.navigate(['dashboard/admin/campaign/', newCampaign?.id]);
          },
          (error: any) => {
            console.error('Error creating campaign:', error);
          }
        );
      }
    }
  }
  
  
  

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

 

//   openAvailabilityDialog(evaluator: EvaluatedUser, day: string): void {
//     if (!evaluator.availableDays) {
//         evaluator.availableDays = [];
//     }

//     const dialogRef = this.dialog.open(AvailabilityDialogComponent, {
//         width: '500px',
//         data: { evaluator, day }
//     });

//     dialogRef.afterClosed().subscribe(result => {
//         if (result) {
//             const availabilityDate = new Date(day);
//             const availabilityDayIndex = evaluator.availableDays!.findIndex(availDay =>
//                 new Date(availDay.date).toDateString() === availabilityDate.toDateString()
//             );

//             if (availabilityDayIndex !== -1) {
//                 evaluator.availableDays![availabilityDayIndex] = { date: availabilityDate, timeRanges: result.timeRanges };
//             } else {
//                 evaluator.availableDays!.push({ date: availabilityDate, timeRanges: result.timeRanges });
//             }
//         }
//     });
// }

openAvailabilityDialog(evaluator: EvaluatedUser, day: string): void {
  if (!evaluator.availableDays) {
      evaluator.availableDays = [];
  }

  const availabilityDate = new Date(day);
  const availability = evaluator.availableDays.find(availDay =>
      new Date(availDay.date).toDateString() === availabilityDate.toDateString()
  );

  const dialogRef = this.dialog.open(AvailabilityDialogComponent, {
      width: '500px',
      data: { evaluator, day, timeRanges: availability ? availability.timeRanges : [] }
  });

  dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const availabilityDate = new Date(day);
                const availabilityDayIndex = evaluator.availableDays!.findIndex(availDay =>
                    new Date(availDay.date).toDateString() === availabilityDate.toDateString()
                );
    
                if (availabilityDayIndex !== -1) {
                    evaluator.availableDays![availabilityDayIndex] = { date: availabilityDate, timeRanges: result.timeRanges };
                } else {
                    evaluator.availableDays!.push({ date: availabilityDate, timeRanges: result.timeRanges });
                }
            }
        });
}


getAvailabilityForDay(evaluator: EvaluatedUser, day: string): { date: Date, timeRanges: Array<{ startTime: string, endTime: string }> } | undefined {
  const availabilityDate = new Date(day);
  return evaluator.availableDays?.find(availDay =>
      new Date(availDay.date).toDateString() === availabilityDate.toDateString()
  );
}

  
  
  
  

  getDaysBetweenDates(startDate: Date, endDate: Date): string[] {
    const days: string[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(currentDate.toDateString());
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return days;
  }

  getTableDates(){
    this.days = this.getDaysBetweenDates(this.thirdFormGroup.value.startDate, this.thirdFormGroup.value.endDate);
  }
  
  
}
