import { LabBaseEntityWithUser, LabUser } from './lab-user.entity';
import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated, FlUser } from '@monorepo/front-core-lib';
import { LabFolder, LabFolderObject } from './lab-folder.class';
import { LabEntity } from '../global/lab-entity.entity';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { LabNoteTemplate } from './lab-note-template.entity';
import {
  TeRichTextContent,
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryModificationDifference,
  TeTextEditorHistoryModificationType,
} from '@monorepo/text-editor';

export type LabNoteContent = TeRichTextContent;

export class LabNote extends LabBaseEntityWithUser implements LabFolderObject {
  title: string;

  @Type(() => LabFolder)
  folder: LabFolder;

  @Expose({ name: 'is_validated' })
  isValidated: boolean;

  @Expose({ name: 'validated_by' })
  @Type(() => LabUser)
  validatedBy?: LabUser;

  @Expose({ name: 'validated_at' })
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({ name: 'last_sync_at' })
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({ name: 'last_sync_by' })
  @Type(() => LabUser)
  lastSyncBy?: LabUser;

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

export type LabNoteDatasource<F = void> = FlDatasourcePaginated<LabNote, F>;

export interface LabNoteForm {
  title: string;
  folder: LabEntity;
  template: LabNoteTemplate;
}

export interface LabNoteInsertTemplateDTO {
  block_index: string;
  note_template_id: string;
}
