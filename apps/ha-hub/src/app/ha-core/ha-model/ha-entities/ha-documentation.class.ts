import {HaEntity} from './ha-entity.class';
import {ClRichTextI} from '@monorepo/core-lib';

export class HaDocumentation extends HaEntity {

  title: string;

  content: ClRichTextI;

  path: string;

  completePath: string;

  folderId: string;

  versionId: string;

  order: number;
}


export class HaDocumentationContentFormDTO extends HaEntity {
  content: ClRichTextI;
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
