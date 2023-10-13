import {CaBaseEntity} from '../ca-base-entity.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {ClRichTextI} from '@monorepo/core-lib';


export class CaDocument extends CaBaseEntity {
  name: string;

  size: number;

  mimeType: string;

  projectId: string;

  isConstellabDocument: boolean;

  inTrash: boolean;
}

export type CaDocumentDatasource = FlDatasourcePaginated<CaDocument>;


export class CaConstellabDocument {

  @Type(() => CaDocument)
  document: CaDocument;

  content: ClRichTextI;
}
