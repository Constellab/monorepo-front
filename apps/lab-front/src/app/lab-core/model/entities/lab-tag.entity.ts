import {FlTag, FlTagEntity, FlTagValue} from '@monorepo/front-core-lib';
import {LabEntity} from '../global/lab-entity.entity';
import {LabNavigableEntityGrouped} from './lab-navigable-entity.entity';
import {Expose, Type} from 'class-transformer';

export type LabEntityTagType = 'EXPERIMENT' | 'REPORT' | 'RESOURCE' | 'VIEW' | 'PROTOCOL_TEMPLATE';


/**
 * Object representing the tag
 */
export class LabTag implements FlTag {
  key: string;
  value: FlTagValue;
}

/**
 * Object representing the tags entity
 */
export class LabTagEntity extends LabEntity implements FlTagEntity {
  key: string;
  values: string[];

  is_propagable: boolean;

  clone(): LabTagEntity {
    const clone = new LabTagEntity();
    clone.id = this.id;
    clone.key = this.key;
    clone.values = this.values;
    return clone;
  }
}

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
