import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-email-verfication',
  templateUrl: './email-verfication.component.html',
  styleUrls: ['./email-verfication.component.scss']
})
export class EmailVerficationComponent {
  @ViewChild('input1') input1: ElementRef;
  @ViewChild('input2') input2: ElementRef;
  @ViewChild('input3') input3: ElementRef;
  @ViewChild('input4') input4: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    this.addInputListeners();
  }

  addInputListeners() {
    this.input1.nativeElement.addEventListener('input', () => {
      if (this.input1.nativeElement.value.length === 1) {
        this.input2.nativeElement.focus();
      }
    });

    this.input2.nativeElement.addEventListener('input', () => {
      if (this.input2.nativeElement.value.length === 1) {
        this.input3.nativeElement.focus();
      }
    });

    this.input3.nativeElement.addEventListener('input', () => {
      if (this.input3.nativeElement.value.length === 1) {
        this.input4.nativeElement.focus();
      }
    });

    this.input4.nativeElement.addEventListener('input', () => {
      if (this.input4.nativeElement.value.length === 1) {
        // Optionally, you can trigger verification here
      }
    });
  }
}
