import {HaEntity} from './ha-entity.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaFile} from '../../entity-module/ha-file-core/model/ha-file';

export class HaDocumentation extends HaEntity {

  title: string;

  content: TeRichTextContent;

  path: string;

  completePath: string;

  folderId: string;

  versionId: string;

  order: number;

  docFiles: HaFile[];

  get files(): HaFile[] {
    return this.docFiles;
  }

  set files(files: HaFile[]) {
    this.docFiles = files;
  }
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
