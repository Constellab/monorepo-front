import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { FlSearchObjectToUrl } from '@monorepo/front-core-lib/fl-search';
import {
  TdTypeObjectStatus,
  TdTypeObjectSubType,
  TdTypeObjectType,
  TdTypeRefDTO,
  TdTypeStyle,
  TdTypeTypingEntity,
  TdTypingErrorDTO,
} from '@monorepo/technical-doc';
import { Expose } from 'class-transformer';

import { LiBaseEntity } from '../../global/li-entity.entity';

export interface LiFileTypeAdditionalInfo {
  default_extensions: string[];
}

export class LiTypeEntity extends LiBaseEntity implements FlSearchObjectToUrl {
  @Expose({ name: 'object_type' })
  objectType: TdTypeObjectType;

  @Expose({ name: 'typing_name' })
  typingName: string;

  @Expose({ name: 'brick_version' })
  brickVersion: string;

  @Expose({ name: 'human_name' })
  humanName: string;

  @Expose({ name: 'short_description' })
  shortDescription: string | undefined;

  @Expose({ name: 'object_sub_type' })
  objectSubType: TdTypeObjectSubType;

  @Expose({ name: 'deprecated_since' })
  deprecatedSince: string | undefined;

  @Expose({ name: 'deprecated_message' })
  deprecatedMessage: string | undefined;

  @Expose({ name: 'additional_info' })
  additionalInfo: any;

  style: TdTypeStyle;

  parent?: TdTypeRefDTO;

  doc: string;

  status: TdTypeObjectStatus;

  errors: TdTypingErrorDTO[] | null;

  get name(): string {
    return this.humanName;
  }

  toString(): string {
    return this.name;
  }

  toUrlJson(): Record<string, any> {
    return { typing_name: this.typingName };
  }

  public static fromResourceType(resourceDto: TdTypeRefDTO): LiTypeEntity {
    const entity = new LiTypeEntity();
    entity.typingName = resourceDto.typing_name;
    entity.humanName = resourceDto.human_name;
    entity.objectType = 'RESOURCE';
    entity.objectSubType = 'RESOURCE';
    entity.status = 'OK';
    entity.brickVersion = resourceDto.brick_version;
    return entity;
  }

  public toTypeRef(): TdTypeRefDTO {
    return {
      typing_name: this.typingName,
      human_name: this.humanName,
      brick_version: this.brickVersion,
      style: this.style,
    };
  }

  public toTypeEntity(): TdTypeTypingEntity {
    return {
      typingName: this.typingName,
      brickVersion: this.brickVersion,
      humanName: this.humanName,
      shortDescription: this.shortDescription,
      doc: this.doc,
      objectType: this.objectType,
      objectSubType: this.objectSubType,
      status: this.status,
      errors: this.errors,
      deprecatedSince: this.deprecatedSince,
      deprecatedMessage: this.deprecatedMessage,
      style: this.style,
      parentTypingName: this.parent?.typing_name,
      parentHumanName: this.parent?.human_name,
      parentVersion: this.parent?.brick_version,
      parentStyle: this.parent?.style,
    };
  }
}

export type LiTypeEntityDatasource<F = void> = FlDatasourcePaginated<LiTypeEntity, F>;
