import { ClRecordTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { Type } from 'class-transformer';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaRootFolderUserRoleObj } from './ca-folder-user.class';

export interface CaDocumentBasicInfo {
  id: string;
  name: string;
  isConstellabDocument: boolean;
  userRole: CaRootFolderUserRoleObj;
}

export class CaDocument extends CaBaseEntity {
  name: string;

  size: number;

  mimeType: string;

  type: 'UPLOADED_DOCUMENT' | 'CONSTELLAB_DOCUMENT';

  canTokenPreview: boolean;

  style: TdTypeStyle;

  isConstellabDocument(): boolean {
    return this.type === 'CONSTELLAB_DOCUMENT';
  }

  isImage(): boolean {
    return this.mimeType.startsWith('image/');
  }

  public static supportsPreview(documentName: string): boolean {
    const extension = FlFileHelper.getFileExtension(documentName);
    return extension != null && ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension);
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
  @Type(() => CaDocument)
  document: CaDocument;

  previewUrl: string;
}

export enum CaDocumentUploadOverrideMode {
  ERROR = 'ERROR', // throw an error if the document already exists
  REPLACE = 'REPLACE', // replace the existing document with the new one
  RENAME = 'RENAME', // rename the new document with '_1' if it already exists
}

export interface CaDocumentCheckSameNameRequest {
  names: string[];
}

export interface CaDocumentCheckSameNameResponse {
  folderHasFileWithSameName: boolean;
}
