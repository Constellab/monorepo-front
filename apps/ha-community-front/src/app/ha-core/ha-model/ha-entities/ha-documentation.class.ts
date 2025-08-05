import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

import { HaFile } from '../../entity-module/ha-file-core/model/ha-file';
import { HaEntity } from './ha-entity.class';

export class HaDocumentation extends HaEntity {
  title: string;

  @TeRichTextTransform()
  content: TeRichText;

  path: string;

  completePath: string;

  folderId: string;

  versionId: string;

  order: number;

  docFiles: HaFile[];
}

export interface HaDocumentationSearchDTO {
  id?: string;
  name: string;
  completePath?: string;
  anchor?: string;
  brickName?: string;
  major?: string;
  isTechnical?: boolean;
}
