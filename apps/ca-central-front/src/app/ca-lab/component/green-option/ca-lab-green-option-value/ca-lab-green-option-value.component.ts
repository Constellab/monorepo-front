import { Component, Input } from '@angular/core';
import {
  CaLabGreenOption,
  CaLabGreenOptionStopAfterInactivityValue,
  CaLabGreenOptionStopAfterTimeValue,
  CaLabGreenOptionType,
} from '../../../../ca-core/model/entities/lab/ca-lab-green-option.class';

@Component({
    selector: 'ca-lab-green-option-value',
    templateUrl: './ca-lab-green-option-value.component.html',
    styleUrls: ['./ca-lab-green-option-value.component.scss'],
    standalone: false
})
export class CaLabGreenOptionValueComponent {
  @Input() greenOption: CaLabGreenOption;

  afterTime = CaLabGreenOptionType.STOP_AFTER_TIME;
  afterInactivity = CaLabGreenOptionType.STOP_AFTER_INACTIVITY_TIME;

  get afterTimeValue(): CaLabGreenOptionStopAfterTimeValue {
    return this.greenOption.value as CaLabGreenOptionStopAfterTimeValue;
  }

  get afterInactivityValue(): CaLabGreenOptionStopAfterInactivityValue {
    return this.greenOption.value as CaLabGreenOptionStopAfterInactivityValue;
  }
}
