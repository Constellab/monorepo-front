import { LabEntity } from '../../global/lab-entity.entity';
import { FlFileHelper } from '@monorepo/front-core-lib';
import { Expose, Type } from 'class-transformer';
import { TdTypeObjectStatus, TdTypeRefDTO, TdTypeStyle } from '@monorepo/technical-doc';
import { LabFlaggedEntity } from '../../global/lab-flagged-entity.class';
import { LabFolder } from '../lab-folder.class';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { PrResource } from '@monorepo/protocol';

/**
 * Represent a file or a folder link to the resource
 */
export class LabFsNodeEntity extends LabEntity {
  // size of the node
  size: number;

  @Expose({ name: 'is_file' })
  isFile: boolean;

  name: string;

  path: string;

  getExtension(): string {
    return FlFileHelper.getFileExtension(this.name);
  }
}

export type LabResourceOrigin = 'UPLOADED' | 'GENERATED' | 'IMPORTED_FROM_LAB' | 'S3_FOLDER_STORAGE';

export class LabResource extends LabBaseEntityWithUser implements LabFlaggedEntity {
  // typing name of the resource
  @Expose({ name: 'resource_typing_name' })
  resourceTypingName: string;

  @Expose({ name: 'fs_node' })
  @Type(() => LabFsNodeEntity)
  fsNode?: LabFsNodeEntity;

  @Expose({ name: 'is_downloadable' })
  isDownloadable: boolean;

  origin: LabResourceOrigin;

  name: string;

  @Expose({ name: 'has_children' })
  hasChildren: boolean;

  @Expose({ name: 'type_status' })
  typeStatus: TdTypeObjectStatus;

  flagged: boolean;

  scenario?: {
    id: string;
    title: string;
  };

  @Type(() => LabFolder)
  folder?: LabFolder;

  @Expose({ name: 'resource_type' })
  resourceType?: TdTypeRefDTO;

  style: TdTypeStyle;

  @Expose({ name: 'shared_with_space' })
  sharedWithSpace: boolean;

  isFsNode(): boolean {
    return this.fsNode != null;
  }

  isFile(): boolean {
    return this.isFsNode() && this.fsNode.isFile;
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
      resourceType: this.resourceType,
      scenario: this.scenario,
      style: this.style,
    };
  }
}
