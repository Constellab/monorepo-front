import { HaBaseEntity } from '../../../ha-model/ha-entities/ha-entity.class';
import { HaFile } from './ha-file';

export class HaBaseEntityWithFiles extends HaBaseEntity {
  files?: HaFile[];
}
