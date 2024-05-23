import {Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self} from '@angular/core';
import {DateTime} from 'luxon';
import {NgControl} from '@angular/forms';
import {FlFormFieldDirective} from '../../../../abstract-directive/form/fl-form-field.directive';
import {ClDateHelper} from '@monorepo/core-lib';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'fl-datetime-picker',
  templateUrl: './fl-datetime-picker.component.html',
  styleUrls: ['./fl-datetime-picker.component.scss']
})
export class FlDatetimePickerComponent extends FlFormFieldDirective<DateTime> implements OnInit, OnDestroy {

  @Input() label: string;
  @Input() minDate: DateTime;
  @Input() maxDate: DateTime;
  @Output() dateTimeChange: EventEmitter<DateTime> = new EventEmitter<DateTime>();

  dateTimeWithoutHours: DateTime;
  hours: number[];
  minutes: number[];
  maxHours = 23;
  maxMinutes = 59;
  selectedDate: DateTime;
  selectedHours: number;
  selectedMinutes: number;

  minDateDay: DateTime;
  minDateHours: number;
  minDateMinutes: number;


  constructor(@Optional() @Self() ngControl: NgControl) {
    super(ngControl);
  }

  ngOnInit(): void {
    if (this.minDate)
      this.minDateDay = this.minDate.set({hour: 0, minute: 0});
    this.updateHoursSelection();
    this.updateMinuteSelection();
  }

  callChangeEvent(value: DateTime): void {
    this.dateTimeChange.emit(value);
  }

  onDisableChange(disable: boolean): void {
    this.disabled = disable;
  }

  writeValue(obj: DateTime): void {
    if (obj == null && this.selectedDate != null){
      this.selectedDate = null;
      this.selectedHours = null;
      this.selectedMinutes = null;
      this.callChangeEvent(null);
    }
    this.value = obj;
  }

  onDatePickerChange(event: MatDatepickerInputEvent<any>): void {
    const date = event.value
    this.dateTimeWithoutHours = date;
    this.selectedDate = date;
    if (this.checkIfDateTimeIsMaxDate()){
      this.maxHours = this.maxDate.hour;
    } else {
      this.maxHours = 23;
    }

    if (this.minDate &&  this.selectedDate.day == this.minDate?.day){
      this.minDateHours = this.minDate.hour;
    } else {
      this.minDateHours = 0;
    }

    this.selectedHours = null;
    this.selectedMinutes = null;
    this.updateHoursSelection();
    this.updateMinuteSelection();
  }

  onHoursChange(event: number): void {
    this.selectedHours = event;

    if (this.minDate && this.selectedDate.day == this.minDate.day && this.selectedHours == this.minDate.hour){
      this.minDateMinutes = this.minDate.minute;
    } else {
      this.minDateMinutes = 0;
    }
    this.selectedMinutes = null;
    this.updateMaxMinutes();
    this.updateMinuteSelection();
  }

  onMinutesChange(event: number): void {
    this.selectedMinutes = event;
    this.validateDate();
  }

  validateDate(): void {
    if (this.selectedDate != null && this.selectedHours != null && this.selectedMinutes != null){
      this.value = this.selectedDate.set({hour: this.selectedHours, minute: this.selectedMinutes});
      this.callChangeEvent(this.value);
    }
  }


  private updateMaxMinutes(): void {
    if (this.checkIfDateTimeIsMaxDate() && this.selectedHours === this.maxHours){
      this.maxMinutes = this.maxDate.minute;
    } else {
      this.maxMinutes = 59;
    }
  }

  private checkIfDateTimeIsMaxDate(): boolean {
    return this.selectedDate.hasSame(this.maxDate, 'day');
  }

  private updateHoursSelection(): void {
    this.hours = [];
    for (let i = this.minDateHours; i <= this.maxHours; i++){
      this.hours.push(i);
    }
  }

  private updateMinuteSelection(): void {
    this.minutes = [];
    for (let i = this.minDateMinutes; i <= this.maxMinutes; i++){
      this.minutes.push(i);
    }
  }

  ngOnDestroy(): void {

  }

}
