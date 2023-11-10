import {FlTag, FlTagEntity, FlTagValue} from '@monorepo/front-core-lib';
import {LabEntity} from '../global/lab-entity.entity';

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

  clone(): LabTagEntity {
    const clone = new LabTagEntity();
    clone.id = this.id;
    clone.key = this.key;
    clone.values = this.values;
    return clone;
  }
}
