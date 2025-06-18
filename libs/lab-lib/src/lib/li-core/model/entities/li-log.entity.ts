import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

export class LiLogInfo {
  name: string;

  @Expose({ name: 'file_size' })
  fileSize: number;
}

export class LiLogsStatus {
  @Expose({ name: 'log_folder' })
  logFolder: string;

  @Type(() => LiLogInfo)
  @Expose({ name: 'log_files' })
  logFiles: LiLogInfo[];
}

export class LiLogCompleteInfo {
  @Type(() => LiLogInfo)
  @Expose({ name: 'log_info' })
  logInfo: LiLogInfo;

  @Type(() => LiLogLine)
  content: LiLogLine[];
}

export type LiLogLevel = 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG' | 'PROGRESS' | 'EXCEPTION';

/**
 * Class that represent one line of a log file
 */
export class LiLogLine {
  level: LiLogLevel;

  @Expose({ name: 'date_time' })
  @ClLuxonDateTimeTransform()
  datetime: DateTime;

  message: string;

  context: 'MAIN' | 'SCENARIO' | 'STREAMLIT' | 'REFLEX';

  @Expose({ name: 'context_id' })
  contextId: string;

  @Expose({ name: 'stack_trace' })
  stackTrace: string;
}

export class LiLogsBetweenDates {
  @Type(() => LiLogLine)
  logs: LiLogLine[];

  @Expose({ name: 'from_date' })
  @ClLuxonDateTimeTransform()
  fromDate: DateTime;

  @Expose({ name: 'to_date' })
  @ClLuxonDateTimeTransform()
  toDate: DateTime;

  @Expose({ name: 'is_last_page' })
  isLastPage: boolean;

  @Expose({ name: 'next_page_date' })
  @ClLuxonDateTimeTransform()
  nextPageDate: DateTime;
}

export class LiLogsArrayObs extends FlArrayObs<LiLogInfo> {
  protected equals(a: LiLogInfo, b: LiLogInfo): boolean {
    return a.name === b.name;
  }
}
