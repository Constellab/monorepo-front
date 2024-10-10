import {
  FlDatasourcePaginated,
  FlEntity,
  FlTag,
  FlTagDatasource,
  FlTagKeyModel,
  FlTagValue,
  FlTagValueFormat,
  FlTagValueModel
} from '@monorepo/front-core-lib';
import { LabBaseEntity } from '../global/lab-entity.entity';
import { LabEntityType, LabNavigableEntityGrouped } from './lab-navigable-entity.entity';
import { Expose, Type } from 'class-transformer';
import { LabUser } from './lab-user.entity';
import { TypeHelpOptions } from 'class-transformer/types/interfaces/type-help-options.interface';

export type LabEntityTagType = 'SCENARIO' | 'NOTE' | 'RESOURCE' | 'VIEW' | 'SCENARIO_TEMPLATE';


/**
 * Object representing the tag
 */
export class LabTag implements FlTag, FlEntity {
  id: string;

  key: string;
  value: FlTagValue;

  @Expose({ name: 'is_user_origin' })
  isUserOrigin: boolean;

  public static newUserTag(key: string, value: FlTagValue): LabTag {
    const tag = new LabTag();
    tag.key = key;
    tag.value = value;
    tag.isUserOrigin = true;
    return tag;
  }
}

/**
 * If the origin is a user, we need to transform the json to a LabUser object
 * @param json
 */
const labTagOriginObjectFactory: any = (json: TypeHelpOptions) => {
  switch (json.object.origin_type) {
    case 'USER':
      return LabUser;
    default:
      return json.object.origin_object;
  }
}

export type LabTagOriginType = 'USER' | 'S3' | 'TASK' | 'TASK_PROPAGATED' | 'SCENARIO_PROPAGATED'
  | 'RESOURCE_PROPAGATED' | 'VIEW_PROPAGATED';

export class LabTagOrigin {

  @Expose({ name: 'origin_type' })
  originType: LabTagOriginType;

  @Expose({ name: 'origin_id' })
  originId: string;

  @Expose({ name: 'origin_object' })
  @Type(labTagOriginObjectFactory)
  originObject: LabUser | string;

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
  get originEntityType(): LabEntityType | null {
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

export class LabTagDetail implements FlTag, FlEntity {

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
export class LabTagKeyModel extends LabBaseEntity implements FlTagKeyModel {
  key: string;

  @Expose({ name: 'value_format' })
  valueFormat: FlTagValueFormat;

  @Expose({ name: 'is_propagable' })
  isPropagable: boolean;

  clone(): LabTagKeyModel {
    const clone = new LabTagKeyModel();
    clone.id = this.id;
    clone.key = this.key;
    return clone;
  }

  toString(): string {
    return this.key;
  }
}

export type LabTagKeyModelDatasource = FlDatasourcePaginated<LabTagKeyModel>;


export class LabTagValueModel extends LabBaseEntity implements FlTagValueModel {

  key: string;

  value: FlTagValue;

  @Expose({ name: 'value_format' })
  valueFormat: FlTagValueFormat;

  toString(): string {
    return this.value.toString();
  }

  toSimpleTag(): FlTag {
    return {
      key: this.key,
      value: this.value
    };
  }
}

export type LabTagValueModelDatasource = FlDatasourcePaginated<LabTagValueModel>;

export class TagPropagationImpactDTO {
  @Type(() => LabTag)
  tags: LabTag[];

  @Expose({ name: 'impacted_entities' })
  @Type(() => LabNavigableEntityGrouped)
  impactedEntities: LabNavigableEntityGrouped[];

  get entityCount(): number {
    return this.impactedEntities.reduce((acc, entity) => acc + entity.entities.length, 0);
  }

  get hasImpactedEntities(): boolean {
    return this.entityCount > 0;
  }
}

export class LabTagDatasource extends FlTagDatasource<LabTag> {

}

export class LabCreateTagResponse {

  @Expose({ name: 'key_model' })
  @Type(() => LabTagKeyModel)
  keyModel: LabTagKeyModel;

  @Expose({ name: 'value_model' })
  @Type(() => LabTagValueModel)
  valueModel: LabTagValueModel;
}
