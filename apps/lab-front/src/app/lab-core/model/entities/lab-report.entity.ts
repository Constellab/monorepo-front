import { LabBaseEntityWithUser, LabUser } from './lab-user.entity';
import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { LabFolder, LabFolderObject } from './lab-folder.class';
import { LabEntity } from '../global/lab-entity.entity';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { LabDocumentTemplate } from './lab-document-template.entity';
import { TeRichTextContent } from '@monorepo/text-editor';

export type LabReportContent = TeRichTextContent;

export class LabReport extends LabBaseEntityWithUser implements LabFolderObject {

  title: string;

  @Type(() => LabFolder)
  folder: LabFolder;

  @Expose({name: 'is_validated'})
  isValidated: boolean;

  @Expose({name: 'validated_by'})
  @Type(() => LabUser)
  validatedBy?: LabUser;

  @Expose({name: 'validated_at'})
  @ClLuxonDateTimeTransform()
  validatedAt?: DateTime;

  @Expose({name: 'last_sync_at'})
  @ClLuxonDateTimeTransform()
  lastSyncAt?: DateTime;

  @Expose({name: 'last_sync_by'})
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

export type LabReportDatasource<F = void> = FlDatasourcePaginated<LabReport, F>;

export interface LabReportForm {
  title: string;
  folder: LabEntity;
  template: LabDocumentTemplate;
}

export interface LabReportInsertTemplateDTO {
  block_index: string;
  document_template_id: string;
}
