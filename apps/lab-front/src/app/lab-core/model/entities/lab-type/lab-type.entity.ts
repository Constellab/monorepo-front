import {LabBaseEntity} from '../../global/lab-entity.entity';
import {Expose} from 'class-transformer';
import {FlDatasourcePaginated, FlSearchObjectToUrl} from '@monorepo/front-core-lib';
import {
  TdTypeEntity,
  TdTypeObjectStatus,
  TdTypeObjectSubType,
  TdTypeObjectType,
  TdTypeRefDTO,
  TdTypeStyle
} from '@monorepo/technical-doc';

export interface LabFileTypeAdditionalInfo {
  default_extensions: string[];
}


export class LabTypeEntity extends LabBaseEntity implements FlSearchObjectToUrl {
  @Expose({name: 'object_type'})
  objectType: TdTypeObjectType;

  @Expose({name: 'typing_name'})
  typingName: string;

  @Expose({name: 'brick_version'})
  brickVersion: string;

  @Expose({name: 'human_name'})
  humanName: string;

  @Expose({name: 'short_description'})
  shortDescription: string | undefined;

  @Expose({name: 'object_sub_type'})
  objectSubType: TdTypeObjectSubType;

  @Expose({name: 'deprecated_since'})
  deprecatedSince: string | undefined;

  @Expose({name: 'deprecated_message'})
  deprecatedMessage: string | undefined;

  @Expose({name: 'additional_info'})
  additionalInfo: any;

  style: TdTypeStyle;

  parent?: TdTypeRefDTO;

  doc: string | undefined;

  status: TdTypeObjectStatus;

  get name(): string {
    return this.humanName;
  }

  toString(): string {
    return this.name;
  }

  toUrlJson(): Record<string, any> {
    return {typing_name: this.typingName};
  }

  public static fromResourceType(resourceDto: TdTypeRefDTO): LabTypeEntity {
    const entity = new LabTypeEntity();
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
      style: this.style
    };
  }

  public toTypeEntity(): TdTypeEntity {
    return {
      typingName: this.typingName,
      brickVersion: this.brickVersion,
      humanName: this.humanName,
      shortDescription: this.shortDescription,
      doc: this.doc,
      objectType: this.objectType,
      objectSubType: this.objectSubType,
      status: this.status,
      deprecatedSince: this.deprecatedSince,
      deprecatedMessage: this.deprecatedMessage,
      style: this.style,
      parentTypingName: this.parent?.typing_name ?? null,
      parentHumanName: this.parent?.human_name ?? null,
      parentVersion: this.parent?.brick_version ?? null,
      parentStyle: this.parent?.style ?? null
    };

  }

}

export type LabTypeEntityDatasource = FlDatasourcePaginated<LabTypeEntity>;

