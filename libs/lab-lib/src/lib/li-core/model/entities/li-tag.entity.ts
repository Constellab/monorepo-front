import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';
import { FlTag, FlTagDatasource, FlTagValue } from '@monorepo/front-core-lib/fl-tag';
import { LiBaseEntity } from '../global/li-entity.entity';
import { LiEntityType, LiNavigableEntityGrouped } from './li-navigable-entity.entity';
import { LiUser } from './li-user.entity';
import { TypeHelpOptions } from 'class-transformer/types/interfaces/type-help-options.interface';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import {
  CoTagKey,
  CoTagKeyAdditionalInfosSpecs,
  CoTagKeyType,
  CoTagValue,
  CoTagValueEditDTO,
} from '@monorepo/community-lib';

export type LiEntityTagType = 'SCENARIO' | 'NOTE' | 'RESOURCE' | 'VIEW' | 'SCENARIO_TEMPLATE';
export type LiTagValueFormat = 'STRING' | 'INTEGER' | 'FLOAT' | 'BOOLEAN' | 'DATETIME';

/**
 * Object representing the tag
 */
export class LiTag implements FlTag, FlEntity {
  id: string;

  key: string;

  label?: string;

  value: FlTagValue;

  @Expose({ name: 'is_community_tag' })
  isCommunityTag: boolean;

  @Expose({ name: 'is_user_origin' })
  isUserOrigin: boolean;

  public static newUserTag(key: string, value: FlTagValue): LiTag {
    const tag = new LiTag();
    tag.key = key;
    tag.value = value;
    tag.isUserOrigin = true;
    tag.isCommunityTag = false;
    return tag;
  }

  public static newCommunityTag(key: string, value: FlTagValue): LiTag {
    const tag = new LiTag();
    tag.key = key;
    tag.value = value;
    tag.isUserOrigin = true;
    tag.isCommunityTag = true;
    return tag;
  }
}

/**
 * If the origin is a user, we need to transform the json to a LiUser object
 * @param json
 */
const labTagOriginObjectFactory: any = (json: TypeHelpOptions) => {
  switch (json.object.origin_type) {
    case 'USER':
      return LiUser;
    default:
      return json.object.origin_object;
  }
};

export type LiTagOriginType =
  | 'USER'
  | 'S3'
  | 'TASK'
  | 'TASK_PROPAGATED'
  | 'SCENARIO_PROPAGATED'
  | 'RESOURCE_PROPAGATED'
  | 'VIEW_PROPAGATED';

export class LiTagOrigin {
  @Expose({ name: 'origin_type' })
  originType: LiTagOriginType;

  @Expose({ name: 'origin_id' })
  originId: string;

  @Expose({ name: 'origin_object' })
  @Type(labTagOriginObjectFactory)
  originObject: LiUser | string;

  get isUserOrigin(): boolean {
    return this.originType === 'USER';
  }

  get originTypeText(): string {
    switch (this.originType) {
      case 'USER':
        return 'user';
      case 'S3':
        return 'tag_origin_s3';
      case 'TASK':
      case 'TASK_PROPAGATED':
        return 'li.task';
      case 'SCENARIO_PROPAGATED':
        return 'li.scenario';
      case 'RESOURCE_PROPAGATED':
        return 'resource';
      case 'VIEW_PROPAGATED':
        return 'li.view';
    }
  }

  /**
   * return the entity type associated if possible
   */
  get originEntityType(): LiEntityType | null {
    switch (this.originType) {
      case 'SCENARIO_PROPAGATED':
        return 'SCENARIO';
      case 'RESOURCE_PROPAGATED':
        return 'RESOURCE';
      case 'VIEW_PROPAGATED':
        return 'VIEW';
      default:
        return null;
    }
  }
}

export class LiTagDetail implements FlTag, FlEntity {
  id: string;

  key: string;

  label: string;

  value: FlTagValue;

  @Expose({ name: 'is_propagable' })
  isPropagable: boolean;

  @Expose({ name: 'created_at' })
  createdAt: string;
}

/**
 * Object representing the tags entity
 */
export class LiTagKeyModel extends LiBaseEntity{
  key: string;

  label?: string;

  @Expose({ name: 'value_format' })
  valueFormat: LiTagValueFormat;

  @Expose({ name: 'is_propagable' })
  isPropagable: boolean;

  @TeRichTextTransform()
  description: TeRichText;

  deprecated: boolean;

  @Expose({ name: 'is_community_tag' })
  isCommunityTag: boolean;

  @Expose({name: 'additional_infos_specs'})
  additionalInfosSpecs?: CoTagKeyAdditionalInfosSpecs;

  clone(): LiTagKeyModel {
    const clone = new LiTagKeyModel();
    clone.id = this.id;
    clone.key = this.key;
    return clone;
  }

  toString(): string {
    return this.key;
  }

  toCoTagKey(): CoTagKey {
    return {
      id: this.id,
      technicalName: this.key,
      label: this.label,
      type: this.valueFormat as CoTagKeyType,
      deprecated: this.deprecated,
      createdAt: this.createdAt,
      description: this.description,
      additionalInfosSpecs: this.additionalInfosSpecs,
    } as CoTagKey;
  }
}

export type LiTagKeyModelDatasource<F = void> = FlDatasourcePaginated<LiTagKeyModel, F>;

export class LiTagValueModel extends LiBaseEntity implements CoTagValue{
  key: string;

  value: FlTagValue;

  @Expose({ name: 'value_format' })
  valueFormat: LiTagValueFormat;

  @Expose({ name: 'is_community_tag_value'})
  isCommunityTagValue?: boolean;

  @Expose({ name: 'short_description' })
  shortDescription?: string;

  @Expose({ name: 'additional_infos' })
  additionalInfos?: Record<string, any>;

  deprecated: boolean;

  toString(): string {
    return this.value.toString();
  }

  toSimpleTag(): FlTag {
    return {
      key: this.key,
      value: this.value,
    };
  }
}

export type LiTagValueModelDatasource = FlDatasourcePaginated<LiTagValueModel>;

export class TagPropagationImpactDTO {
  @Type(() => LiTag)
  tags: LiTag[];

  @Expose({ name: 'impacted_entities' })
  @Type(() => LiNavigableEntityGrouped)
  impactedEntities: LiNavigableEntityGrouped[];

  get entityCount(): number {
    return this.impactedEntities.reduce((acc, entity) => acc + entity.entities.length, 0);
  }

  get hasImpactedEntities(): boolean {
    return this.entityCount > 0;
  }
}

export class LiTagDatasource extends FlTagDatasource<LiTag> {}

export class LiCreateTagResponse {
  @Expose({ name: 'key_model' })
  @Type(() => LiTagKeyModel)
  keyModel: LiTagKeyModel;

  @Expose({ name: 'value_model' })
  @Type(() => LiTagValueModel)
  valueModel: LiTagValueModel;
}

export class LiTagValueNotSynchronized {
  @Type(() => LiTagValueModel)
  @Expose({ name: 'old_value' })
  oldValue: LiTagValueModel;

  @Type(() => LiTagValueModel)
  @Expose({ name: 'new_value' })
  newValue: LiTagValueModel;

  @Expose({ name: 'not_synchronized_fields' })
  notSynchronizedFields: string[];
}

export class LiTagKeyNotSynchronized {
  @Type(() => LiTagKeyModel)
  @Expose({name: 'old_key'})
  oldKey: LiTagKeyModel;

  @Type(() => LiTagKeyModel)
  @Expose({name: 'new_key'})
  newKey: LiTagKeyModel;

  @Expose({name: 'not_synchronized_fields'})
  notSynchronizedFields: string[];

  @Type(() => LiTagValueNotSynchronized)
  @Expose({name: 'not_synchronized_values'})
  notSynchronizedValues: LiTagValueNotSynchronized[];
}

export class LiTagsNotSynchronized {
  @Type(() => LiTagKeyNotSynchronized)
  @Expose({name: 'tag_keys_not_synchronized'})
  tagKeysNotSynchronized: LiTagKeyNotSynchronized[];
}


export class LiTagValueEditDTO {
  id?: string;
  value: FlTagValue;
  @Expose({ name: 'short_description' })
  shortDescription?: string;
  @Expose({ name: 'additional_infos' })
  additionalInfos?: Record<string, any>;
  @Expose({ name: 'tag_key' })
  tagKey: string;

  static fromCoTagValueEditDTO(editDto: CoTagValueEditDTO): LiTagValueEditDTO {
    const dto = new LiTagValueEditDTO();
    dto.id = editDto.id;
    dto.value = editDto.value;
    dto.shortDescription = editDto.shortDescription;
    dto.additionalInfos = editDto.additionalInfos;
    dto.tagKey = editDto.tagKey.technicalName;
    return dto;
  }
}
