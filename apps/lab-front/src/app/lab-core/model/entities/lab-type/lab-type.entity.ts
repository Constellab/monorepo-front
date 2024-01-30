import {LabBaseEntity} from '../../global/lab-entity.entity';
import {Expose} from 'class-transformer';
import {FlDatasourcePaginated, FlSearchObjectToUrl} from '@monorepo/front-core-lib';
import {
  TdResourceTypeDTO,
  TdTypeEntity,
  TdTypeObjectStatus,
  TdTypeObjectSubType,
  TdTypeObjectType
} from '@monorepo/technical-doc';

export interface LabFileTypeAdditionalInfo {
  default_extensions: string[];
}

export class LabTypeEntity extends LabBaseEntity implements TdTypeEntity, FlSearchObjectToUrl {
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

  parent?: {
    brick_version: string;
    human_name: string;
    typing_name: string;
  };


  doc: string | undefined;

  status: TdTypeObjectStatus;

  hasDocumentation(): boolean {
    return this?.doc != null ?? false;
  }

  get name(): string {
    return this.humanName;
  }

  get parentTypingName(): string {
    return this.parent?.typing_name ?? null;
  }

  get parentHumanName(): string {
    return this.parent?.human_name ?? null;
  }

  get parentVersion(): string {
    return this.parent?.brick_version ?? null;
  }

  toString(): string {
    return this.name;
  }

  toUrlJson(): Record<string, any> {
    return {typing_name: this.typingName}
  }

  public static fromResourceType(resourceDto: TdResourceTypeDTO): LabTypeEntity{
    const entity = new LabTypeEntity();
    entity.typingName = resourceDto.typing_name;
    entity.humanName = resourceDto.human_name;
    entity.shortDescription = resourceDto.short_description;
    entity.objectType = 'RESOURCE';
    entity.objectSubType = 'RESOURCE';
    entity.status = 'OK';
    entity.brickVersion = resourceDto.brick_version;
    return entity;
  }

  public toResourceType(): TdResourceTypeDTO{
    return {
      typing_name: this.typingName,
      human_name: this.humanName,
      short_description: this.shortDescription,
      brick_version: this.brickVersion
    }
  }

}

export type LabTypeEntityDatasource = FlDatasourcePaginated<LabTypeEntity>;

