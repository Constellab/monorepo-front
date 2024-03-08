import {FlEntity} from '@monorepo/front-core-lib';
import {TdSimpleTypeEntity, TdTypeStyle} from '@monorepo/technical-doc';

export interface PrResource extends FlEntity {
  name: string;

  resourceTypingName: string;

  resourceType: TdSimpleTypeEntity | null;

  style: TdTypeStyle;

  experiment: {
    id: string;
    title: string;
  } | null;
}
