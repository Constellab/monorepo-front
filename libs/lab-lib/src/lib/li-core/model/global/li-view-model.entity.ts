import { LiBaseEntity } from './li-entity.entity';

export class LiViewModel<T extends LiBaseEntity> extends LiBaseEntity {
  type: 'gws.model.ViewModel';

  model: T;

  id: '';
}
