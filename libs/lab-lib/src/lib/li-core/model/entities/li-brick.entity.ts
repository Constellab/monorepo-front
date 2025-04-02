import { ClVersion, ClVersionTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { LiEntity } from '../global/li-entity.entity';

export type LiBrickMessageStatus = 'INFO' | 'ERROR' | 'CRITICAL' | 'WARNING';

const labBrickMessageStatusDict: FlStatusDict<LiBrickMessageStatus> = {
  INFO: FlStatusHelper.getInfoStatus('INFO', 'li.info'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'li.error'),
  CRITICAL: FlStatusHelper.getCriticalStatus('CRITICAL', 'li.critical'),
  WARNING: FlStatusHelper.getWarningStatus('WARNING', 'li.warning'),
};

export class LiBrickMessage {
  message: string;

  @FlStatusTransform(labBrickMessageStatusDict)
  status: FlStatus<LiBrickMessageStatus>;
}

export type LiBrickStatus = 'SUCCESS' | 'ERROR' | 'CRITICAL' | 'WARNING';

const labBrickStatusDict: FlStatusDict<LiBrickStatus> = {
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'li.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'li.error'),
  CRITICAL: FlStatusHelper.getCriticalStatus('CRITICAL', 'li.critical'),
  WARNING: FlStatusHelper.getWarningStatus('WARNING', 'li.warning'),
};

export class LiBrickEntity extends LiEntity {
  name: string;

  @FlStatusTransform(labBrickStatusDict)
  status: FlStatus<LiBrickStatus>;

  @Type(() => LiBrickMessage)
  messages: LiBrickMessage[];

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

export class LiBrickMigration {
  @ClVersionTransform()
  version: ClVersion;

  @Expose({ name: 'short_description' })
  shortDescription: string;
}
