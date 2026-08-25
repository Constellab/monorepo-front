import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { PrResource } from '@monorepo/protocol';
import { TdTypeObjectStatus, TdTypeRefDTO, TdTypeStyle, TdTypingErrorDTO } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';

import { LiEntity } from '../../global/li-entity.entity';
import { LiFlaggedEntity } from '../../global/li-flagged-entity.class';
import { LiFolder } from '../li-folder.class';
import { LiBaseEntityWithUser } from '../li-user.entity';

/**
 * Represent a file or a folder link to the resource
 */
export class LiFsNodeEntity extends LiEntity {
  // size of the node
  size: number;

  @Expose({ name: 'is_file' })
  isFile: boolean;

  name: string;

  path: string;

  getExtension(): string | null {
    return FlFileHelper.getFileExtension(this.name);
  }
}

export type LiResourceOrigin = 'UPLOADED' | 'GENERATED' | 'IMPORTED_FROM_LAB' | 'S3_FOLDER_STORAGE';

export class LiResource extends LiBaseEntityWithUser implements LiFlaggedEntity {
  // typing name of the resource
  @Expose({ name: 'resource_typing_name' })
  resourceTypingName: string;

  @Expose({ name: 'fs_node' })
  @Type(() => LiFsNodeEntity)
  fsNode?: LiFsNodeEntity;

  @Expose({ name: 'is_downloadable' })
  isDownloadable: boolean;

  origin: LiResourceOrigin;

  name: string;

  @Expose({ name: 'has_children' })
  hasChildren: boolean;

  @Expose({ name: 'type_status' })
  typeStatus: TdTypeObjectStatus;

  @Expose({ name: 'type_errors' })
  typeErrors: TdTypingErrorDTO[] | null;

  flagged: boolean;

  scenario?: {
    id: string;
    title: string;
  };

  @Type(() => LiFolder)
  folder?: LiFolder;

  @Expose({ name: 'resource_type' })
  resourceType?: TdTypeRefDTO;

  style: TdTypeStyle;

  @Expose({ name: 'shared_with_space' })
  sharedWithSpace: boolean;

  @Expose({ name: 'is_application' })
  isApplication: boolean;

  @Expose({ name: 'content_is_deleted' })
  contentIsDeleted: boolean;

  isLoaded(): boolean {
    return this.name != null;
  }

  isFsNode(): boolean {
    return this.fsNode != null;
  }

  isFile(): boolean {
    return this.fsNode != null && this.fsNode.isFile;
  }

  canUpdateType(): boolean {
    return this.origin === 'UPLOADED';
  }

  isUpdatable(): boolean {
    return this.origin !== 'S3_FOLDER_STORAGE';
  }

  isDeletable(): boolean {
    return this.origin !== 'S3_FOLDER_STORAGE';
  }

  toPrResource(): PrResource {
    return {
      id: this.id,
      name: this.name,
      resourceTypingName: this.resourceTypingName,
      resourceType: this.resourceType ?? null,
      scenario: this.scenario ?? null,
      style: this.style,
    };
  }

  toString(): string {
    return this.name;
  }
}

export type LiResourceDatasource<F = void> = FlEntityPaginatedDatasource<LiResource, F>;
