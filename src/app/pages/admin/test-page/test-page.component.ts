import { Component } from '@angular/core';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent {
  selectedDates: Date[] = [];

  dateSelected(event: any) {
    const selectedDate = event instanceof Date ? event : new Date(event);

    const index = this.selectedDates.findIndex(date => this.isSameDate(date, selectedDate));

    if (index >= 0) {
      // Date is already selected, so remove it
      this.selectedDates.splice(index, 1);
    } else {
      // Date is not selected, so add it
      this.selectedDates.push(selectedDate);
    }

    // Sort dates
    this.selectedDates.sort((a, b) => a.getTime() - b.getTime());

    console.log('Selected dates:', this.selectedDates); // Debugging
  }

  private isSameDate(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  // Custom method to apply CSS classes to selected dates
  dateClass = (date: Date): string => {
    const isSelected = this.selectedDates.some(selectedDate => this.isSameDate(selectedDate, date));
    console.log('Checking date:', date, 'Is selected:', isSelected); // Debugging
    return isSelected ? 'selected-date' : '';
  }
}
