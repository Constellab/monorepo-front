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
import {LabBaseEntity} from '../global/lab-entity.entity';
import {LabNavigableEntityGrouped} from './lab-navigable-entity.entity';
import {Expose, Type} from 'class-transformer';

export type LabEntityTagType = 'EXPERIMENT' | 'REPORT' | 'RESOURCE' | 'VIEW' | 'PROTOCOL_TEMPLATE';


/**
 * Object representing the tag
 */
export class LabTag implements FlTag, FlEntity {
  id: string;

  key: string;
  value: FlTagValue;

  @Expose({name: 'is_user_origin'})
  isUserOrigin: boolean;

  public static newUserTag(key: string, value: FlTagValue): LabTag {
    const tag = new LabTag();
    tag.key = key;
    tag.value = value;
    tag.isUserOrigin = true;
    return tag;
  }
}


export class LabTagOrigin {

  @Expose({name: 'origin_type'})
  originType: string;

  @Expose({name: 'origin_id'})
  originId: string;
}

export class LabTagDetail implements FlTag, FlEntity {

  id: string;

  key: string;
  value: FlTagValue;

  @Expose({name: 'is_propagable'})
  isPropagable: boolean;

  @Type(() => LabTagOrigin)
  origins: LabTagOrigin[];

  @Expose({name: 'created_at'})
  createdAt: string;
}


/**
 * Object representing the tags entity
 */
export class LabTagKeyModel extends LabBaseEntity implements FlTagKeyModel {
  key: string;

  @Expose({name: 'value_format'})
  valueFormat: FlTagValueFormat;

  @Expose({name: 'is_propagable'})
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

  @Expose({name: 'value_format'})
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

  @Expose({name: 'impacted_entities'})
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

export class LabCreateTagResponse{

  @Expose({name: 'key_model'})
  @Type(() => LabTagKeyModel)
  keyModel: LabTagKeyModel;

  @Expose({name: 'value_model'})
  @Type(() => LabTagValueModel)
  valueModel: LabTagValueModel;
}
