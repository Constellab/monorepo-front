import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiEntity } from '../global/li-entity.entity';
import { LiFolder, LiFolderObject } from './li-folder.class';
import { LiNoteTemplate } from './li-note-template.entity';
import { LiBaseEntityWithUser, LiUser } from './li-user.entity';

export class LiNote extends LiBaseEntityWithUser implements LiFolderObject {
  title: string;

  @Type(() => LiFolder)
  folder: LiFolder;

  @Expose({ name: 'is_validated' })
  isValidated: boolean;

  @Expose({ name: 'validated_by' })
  @Type(() => LiUser)
  validatedBy?: LiUser;

  @Expose({ name: 'validated_at' })
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({ name: 'last_sync_at' })
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({ name: 'last_sync_by' })
  @Type(() => LiUser)
  lastSyncBy?: LiUser;

  get isSynced(): boolean {
    return this.lastSyncAt != null;
  }

  isEditable(): boolean {
    return !this.isArchived && !this.isValidated;
  }

  toString(): string {
    return this.title;
  }
}

export type LiNoteDatasource<F = void> = FlDatasourcePaginated<LiNote, F>;

export interface LiNoteForm {
  title: string;
  folder: LiEntity;
  template: LiNoteTemplate;
}

export interface LiNoteInsertTemplateDTO {
  block_index: string;
  note_template_id: string;
}
