import {FlEntity} from '@monorepo/front-core-lib';
import {TdSimpleTypeEntity} from '@monorepo/technical-doc';

export interface PrResource extends FlEntity {
  name: string;

  resourceTypingName: string;

  resourceType?: TdSimpleTypeEntity;

  experiment?: {
    id: string;
    title: string;
  };

}
