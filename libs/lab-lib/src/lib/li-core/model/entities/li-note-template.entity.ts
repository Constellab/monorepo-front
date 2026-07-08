import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText, teRichTextTransform } from '@monorepo/text-editor';

import { LiBaseEntityWithUser } from './li-user.entity';

export class LiNoteTemplate extends LiBaseEntityWithUser {
  title: string;

  @teRichTextTransform()
  content: TeRichText;

  toString(): string {
    return this.title;
  }
}

export type LiNoteTemplateDatasource<F = void> = FlDatasourcePaginated<LiNoteTemplate, F>;

export interface LiNoteTemplateForm {
  title: string;
}
