import { CaBaseEntity } from '../ca-base-entity.class';
import { FlDatasourcePaginated, FlFileHelper } from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { ClRecordTransform } from '@monorepo/core-lib';
import { TdTypeStyle } from '@monorepo/technical-doc';

export interface CaDocumentBasicInfo {
  id: string;
  name: string;
  isConstellabDocument: boolean;
  inTrash: boolean;
}

export class CaDocument extends CaBaseEntity {
  name: string;

  size: number;

  mimeType: string;

  type: 'UPLOADED_DOCUMENT' | 'CONSTELLAB_DOCUMENT';

  inTrash: boolean;

  canTokenPreview: boolean;

  style: TdTypeStyle;

  isConstellabDocument(): boolean {
    return this.type === 'CONSTELLAB_DOCUMENT';
  }

  public static supportsPreview(documentName: string): boolean {
    const extension = FlFileHelper.getFileExtension(documentName);
    return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);
  }

  get basicInfo(): CaDocumentBasicInfo {
    return {
      id: this.id,
      name: this.name,
      isConstellabDocument: this.isConstellabDocument(),
      inTrash: this.inTrash,
    };
  }
}

export type CaDocumentDatasource = FlDatasourcePaginated<CaDocument>;

export class CaConstellabDocument {
  @Type(() => CaDocument)
  document: CaDocument;

  @TeRichTextTransform()
  content: TeRichText;
}

export enum CaFolderDocumentStorageType {
  UPLOADED_DOCUMENT = 'UPLOADED_DOCUMENT',
  CONSTELLAB_DOCUMENT = 'CONSTELLAB_DOCUMENT',
  DESCRIPTION = 'DESCRIPTION',
  NOTE = 'NOTE',
  MESSAGE = 'MESSAGE',
}

export class CaStorageUsageDTO {
  totalSize: number;
  totalDocuments: number;
}

export class CaStorageLocationUsageDTO {
  totalSize: number;
  totalDocuments: number;

  @ClRecordTransform(CaStorageUsageDTO)
  details: Record<CaFolderDocumentStorageType, CaStorageUsageDTO>;
}

export class CaFolderStorageUsageDTO {
  totalSize: number;
  totalDocuments: number;

  @Type(() => CaStorageLocationUsageDTO)
  cloudDetails: CaStorageLocationUsageDTO;

  @Type(() => CaStorageLocationUsageDTO)
  dataHubDetails: CaStorageLocationUsageDTO;

  hasMultipleStorageLocations(): boolean {
    return this.dataHubDetails != null && this.cloudDetails != null;
  }
}

export class CaDocumentPreviewDTO {
  previewUrl: string;
}
