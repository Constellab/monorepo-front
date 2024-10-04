import { CaBaseEntity } from '../ca-base-entity.class';
import { ClHelpService } from '@monorepo/core-lib';


export enum CaLabGreenOptionType {
  // Stop rules
  STOP_AFTER_SCENARIO = 'STOP_AFTER_SCENARIO',
  STOP_AFTER_BACKUP = 'STOP_AFTER_BACKUP',
  STOP_AFTER_TIME = 'STOP_AFTER_TIME',
  STOP_AFTER_INACTIVITY_TIME = 'STOP_AFTER_INACTIVITY_TIME',
}

export interface CaLabGreenOptionStopAfterTimeValue {
  // hours and minutes are based on UTC time
  // after the time is reached, the lab will be stopped
  hours: number;
  minutes: number;
  timezone: string;
}

export interface CaLabGreenOptionStopAfterInactivityValue {
  // inactivity time in minutes
  inactivityDuration: number;
}

export class CaLabGreenOption extends CaBaseEntity {

  type: CaLabGreenOptionType;

  value: Record<string, any>;

  isPersistent: boolean;

  hasValue(): boolean{
    return !ClHelpService.isNullOrEmpty(this.value);
  }
}

export interface CaLabGreenOptionFormDto {
  type: CaLabGreenOptionType;

  value: any;

  isPersistent: boolean;
}
