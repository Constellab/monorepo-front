import {CaBaseEntity} from '../ca-base-entity.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {TeRichTextContent} from '@monorepo/text-editor';
import {ClRecordTransform} from '@monorepo/core-lib';


export class CaDocument extends CaBaseEntity {
  name: string;

  size: number;

  mimeType: string;

  projectId: string;

  type: 'UPLOADED_DOCUMENT' | 'CONSTELLAB_DOCUMENT';

  inTrash: boolean;
}

export type CaDocumentDatasource = FlDatasourcePaginated<CaDocument>;


export class CaConstellabDocument {

  @Type(() => CaDocument)
  document: CaDocument;

  content: TeRichTextContent;
}


export enum CaProjectDocumentStorageType {
  UPLOADED_DOCUMENT = 'UPLOADED_DOCUMENT',
  CONSTELLAB_DOCUMENT = 'CONSTELLAB_DOCUMENT',
  DESCRIPTION = 'DESCRIPTION',
  REPORT = 'REPORT',
  COMMENT = 'COMMENT'
}

export class CaStorageUsageDTO {
  totalSize: number;
  totalDocuments: number;
}

export class CaStorageLocationUsageDTO {
  totalSize: number;
  totalDocuments: number;

  @ClRecordTransform(CaStorageUsageDTO)
  details: Record<CaProjectDocumentStorageType, CaStorageUsageDTO>;
}

export class CaProjectStorageUsageDTO {
  totalSize: number;
  totalDocuments: number;

  @Type(() => CaStorageLocationUsageDTO)
  cloudDetails: CaStorageLocationUsageDTO;

  @Type(() => CaStorageLocationUsageDTO)
  dataHubDetails: CaStorageLocationUsageDTO;

  hasMultipleStorageLocations(): boolean{
    return this.dataHubDetails != null && this.cloudDetails != null;
  }

}
