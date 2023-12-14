import {LabTypeEntity} from './lab-type.entity';
import {TdResourceMethodList, TdResourceType} from '@monorepo/technical-doc';

export class LabResourceType extends LabTypeEntity implements TdResourceType {

  methods?: TdResourceMethodList;

}
