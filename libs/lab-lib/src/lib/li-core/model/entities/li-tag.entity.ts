import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';
import { FlTag, FlTagDatasource, FlTagValue } from '@monorepo/front-core-lib/fl-tag';
import { LiBaseEntity } from '../global/li-entity.entity';
import { LiEntityType, LiNavigableEntityGrouped } from './li-navigable-entity.entity';
import { LiUser } from './li-user.entity';
import { TypeHelpOptions } from 'class-transformer/types/interfaces/type-help-options.interface';

export type LiEntityTagType = 'SCENARIO' | 'NOTE' | 'RESOURCE' | 'VIEW' | 'SCENARIO_TEMPLATE';
export type LiTagValueFormat = 'STRING' | 'INTEGER' | 'FLOAT' | 'DATETIME';

/**
 * Object representing the tag
 */
export class LiTag implements FlTag, FlEntity {
  id: string;

  key: string;
  value: FlTagValue;

  @Expose({ name: 'is_user_origin' })
  isUserOrigin: boolean;

  public static newUserTag(key: string, value: FlTagValue): LiTag {
    const tag = new LiTag();
    tag.key = key;
    tag.value = value;
    tag.isUserOrigin = true;
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
        return 'biox.task';
      case 'SCENARIO_PROPAGATED':
        return 'biox.scenario';
      case 'RESOURCE_PROPAGATED':
        return 'resource';
      case 'VIEW_PROPAGATED':
        return 'biox.view';
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
  value: FlTagValue;

  @Expose({ name: 'is_propagable' })
  isPropagable: boolean;

  @Expose({ name: 'created_at' })
  createdAt: string;
}

/**
 * Object representing the tags entity
 */
export class LiTagKeyModel extends LiBaseEntity {
  key: string;

  @Expose({ name: 'value_format' })
  valueFormat: LiTagValueFormat;

  @Expose({ name: 'is_propagable' })
  isPropagable: boolean;

  clone(): LiTagKeyModel {
    const clone = new LiTagKeyModel();
    clone.id = this.id;
    clone.key = this.key;
    return clone;
  }

  toString(): string {
    return this.key;
  }
}

export type LiTagKeyModelDatasource = FlDatasourcePaginated<LiTagKeyModel>;

export class LiTagValueModel extends LiBaseEntity {
  key: string;

  value: FlTagValue;

  @Expose({ name: 'value_format' })
  valueFormat: LiTagValueFormat;

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
