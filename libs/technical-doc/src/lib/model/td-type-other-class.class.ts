import { TdTechDocFunction } from './td-resource-type.class';
import { TdTypeEntity } from './td-type.class';

export interface TdTypeOtherClass extends TdTypeEntity {
  variables: Record<string, any>;
  methods: TdTechDocFunction[];
}
