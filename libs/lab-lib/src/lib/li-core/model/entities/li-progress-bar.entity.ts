import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiEntity } from '../global/li-entity.entity';

export type LiProgressBarMessageType = 'SUCCESS' | 'INFO' | 'ERROR' | 'WARNING' | 'PROGRESS' | 'DEBUG';

const labProgressBarMessageTypeDict: FlStatusDict<LiProgressBarMessageType> = {
  DEBUG: FlStatusHelper.getDebugStatus('DEBUG', 'li.debug'),
  INFO: FlStatusHelper.getInfoStatus('INFO', 'li.info'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'li.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'li.error'),
  WARNING: FlStatusHelper.getWarningStatus('WARNING', 'li.warning'),
  PROGRESS: FlStatusHelper.getInfoStatus('PROGRESS', 'li.progress_bar_progress', 'cached'),
};

/**
 * Different step of the progress bar, each message has a timestamp
 */
export class LiProgressMessage {
  @ClLuxonDateTimeTransform()
  datetime: DateTime;

  text: string;

  @FlStatusTransform(labProgressBarMessageTypeDict)
  type: FlStatus<LiProgressBarMessageType>;

  progress?: number;
}

export class LiProgressBar extends LiEntity {
  @Expose({ name: 'started_at' })
  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @Expose({ name: 'ended_at' })
  @ClLuxonDateTimeTransform()
  endedAt: DateTime;

  // value of the progress between 0 and 100
  @Expose({ name: 'current_value' })
  currentValue: number;

  @Expose({ name: 'elapsed_time' })
  elapsedTime: number;

  @Expose({ name: 'second_start' })
  @ClLuxonDateTimeTransform()
  secondStart: DateTime;

  isRunning(): boolean {
    return this.startedAt != null && !this.endedAt;
  }
}

/**
 * Object that contains list of messages between 2 date of the progress bar
 */
export class LiProgressBarMessages extends LiProgressBar {
  @Expose({ name: 'from_datetime' })
  @ClLuxonDateTimeTransform()
  fromDatetime: DateTime;

  @Expose({ name: 'to_datetime' })
  @ClLuxonDateTimeTransform()
  toDatetime: DateTime;

  @Type(() => LiProgressMessage)
  messages: LiProgressMessage[];
}

export class LiProgressMessageDatasource extends FlArrayObs<LiProgressMessage> {
  protected equals(a: LiProgressMessage, b: LiProgressMessage): boolean {
    return a.datetime.equals(b.datetime) && a.text === b.text && a.type.value === b.type.value;
  }
}
