import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { LiBaseEntityWithUser } from './li-user.entity';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export class LiNoteTemplate extends LiBaseEntityWithUser {
  title: string;

  @TeRichTextTransform()
  content: TeRichText;

  toString(): string {
    return this.title;
  }
}

export type LiNoteTemplateDatasource<F = void> = FlDatasourcePaginated<LiNoteTemplate, F>;

export interface LiNoteTemplateForm {
  title: string;
}
