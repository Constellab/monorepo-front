import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiBaseEntityWithUser } from './li-user.entity';

export enum LiTriggerType {
  CRON = 'CRON',
}

export enum LiJobStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  RUNNING = 'RUNNING',
}

export class LiTriggeredJobRun {
  @Expose({ name: 'triggered_job_id' })
  triggeredJobId: string;

  trigger: string;

  @Expose({ name: 'scenario_id' })
  scenarioId: string | null;

  @Expose({ name: 'started_at' })
  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @Expose({ name: 'ended_at' })
  @ClLuxonDateTimeTransform()
  endedAt: DateTime | null;

  status: LiJobStatus;

  @Expose({ name: 'error_info' })
  errorInfo: Record<string, any> | null;

  @Expose({ name: 'duration_seconds' })
  durationSeconds: number | null;
}

export class LiTriggeredJob extends LiBaseEntityWithUser {
  name: string;
  description: string | null;

  @Expose({ name: 'trigger_type' })
  triggerType: LiTriggerType;

  @Expose({ name: 'is_active' })
  isActive: boolean;

  @Expose({ name: 'cron_expression' })
  cronExpression: string | null;

  @Expose({ name: 'next_run_at' })
  @ClLuxonDateTimeTransform()
  nextRunAt: DateTime | null;

  @Expose({ name: 'process_typing' })
  processTyping: any | null;

  @Expose({ name: 'scenario_template_id' })
  scenarioTemplateId: string | null;

  @Expose({ name: 'scenario_template_name' })
  scenarioTemplateName: string | null;

  @Expose({ name: 'config_values' })
  configValues: Record<string, any> | null;

  @Expose({ name: 'last_run' })
  @Type(() => LiTriggeredJobRun)
  lastRun: LiTriggeredJobRun | null;
}

export class LiCreateTriggeredJobFromTemplateDTO {
  scenario_template_id: string;
  name: string;
  description: string | null;
  cron_expression: string;
  is_active: boolean;
}

export class LiTriggeredJobArrayObs extends FlArrayObs<LiTriggeredJob> {
  protected equals(a: LiTriggeredJob, b: LiTriggeredJob): boolean {
    return a.id === b.id;
  }
}
