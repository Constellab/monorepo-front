import {TdTypeEntity} from "./td-type.class";
import {TdTechDocFunction} from './td-resource-type.class';


export interface TdTypeOtherClass extends TdTypeEntity {
  variables: Record<string, any>;
  methods: TdTechDocFunction[];
}
