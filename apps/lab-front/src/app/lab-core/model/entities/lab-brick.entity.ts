import { LabEntity } from '../global/lab-entity.entity';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { Expose, Type } from 'class-transformer';
import { ClVersion, ClVersionTransform } from '@monorepo/core-lib';

export type LabBrickMessageStatus = 'INFO' | 'ERROR' | 'CRITICAL' | 'WARNING';

const labBrickMessageStatusDict: FlStatusDict<LabBrickMessageStatus> = {
  INFO: FlStatusHelper.getInfoStatus('INFO', 'info'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
  CRITICAL: FlStatusHelper.getCriticalStatus('CRITICAL', 'critical'),
  WARNING: FlStatusHelper.getWarningStatus('WARNING', 'warning'),
};

export class LabBrickMessage {
  message: string;

  @FlStatusTransform(labBrickMessageStatusDict)
  status: FlStatus<LabBrickMessageStatus>;
}

export type LabBrickStatus = 'SUCCESS' | 'ERROR' | 'CRITICAL' | 'WARNING';

const labBrickStatusDict: FlStatusDict<LabBrickStatus> = {
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
  CRITICAL: FlStatusHelper.getCriticalStatus('CRITICAL', 'critical'),
  WARNING: FlStatusHelper.getWarningStatus('WARNING', 'warning'),
};

export class LabBrickEntity extends LabEntity {
  name: string;

  @FlStatusTransform(labBrickStatusDict)
  status: FlStatus<LabBrickStatus>;

  @Type(() => LabBrickMessage)
  messages: LabBrickMessage[];

  version: string;

  @Expose({ name: 'repo_type' })
  repoType: 'app';

  @Expose({ name: 'repo_commit' })
  repoCommit?: string;

  @Expose({ name: 'parent_name' })
  parentName?: string;

  @Expose({ name: 'brick_path' })
  brickPath: string;

  countMessages(): number {
    return this.messages.length ?? 0;
  }
}

export class LabBrickMigration {
  @ClVersionTransform()
  version: ClVersion;

  @Expose({ name: 'short_description' })
  shortDescription: string;
}
