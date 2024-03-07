import {LabTypeEntity} from './lab-type.entity';
import {TdResourceMethodList, TdResourceType} from '@monorepo/technical-doc';

export class LabResourceType extends LabTypeEntity {

  methods: TdResourceMethodList;

  public toTypeEntity(): TdResourceType {
    return {
      ...super.toTypeEntity(),
      methods: this.methods,
    };
  }

}
