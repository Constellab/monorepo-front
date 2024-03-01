import {HaEntity} from './ha-entity.class';
import {ClRichTextI} from '@monorepo/core-lib';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaFile} from './ha-file';

export class HaDocumentation extends HaEntity {

  title: string;

  content: TeRichTextContent;

  path: string;

  completePath: string;

  folderId: string;

  versionId: string;

  order: number;

  docFiles: HaFile[];
}


export class HaDocumentationContentFormDTO extends HaEntity {
  content: TeRichTextContent;
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
