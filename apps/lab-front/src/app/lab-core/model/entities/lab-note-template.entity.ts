import { LabBaseEntityWithUser } from './lab-user.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export class LabNoteTemplate extends LabBaseEntityWithUser {
  title: string;

  @TeRichTextTransform()
  content: TeRichText;

  toString(): string {
    return this.title;
  }
}

export type LabNoteTemplateDatasource<F = void> = FlDatasourcePaginated<LabNoteTemplate, F>;

export interface LabNoteTemplateForm {
  title: string;
}
