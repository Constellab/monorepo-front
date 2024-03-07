import {LabBaseEntity} from './lab-entity.entity';

export class LabViewModel<T extends LabBaseEntity> extends LabBaseEntity {

  type: 'gws.model.ViewModel';

  model: T;

  id: '';
}

