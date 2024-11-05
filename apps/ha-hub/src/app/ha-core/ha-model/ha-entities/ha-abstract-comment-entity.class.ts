import { HaBaseEntity, HaEntity } from './ha-entity.class';
import { TeRichTextContent } from '@monorepo/text-editor';

export abstract class HaAbstractCommentEntity<T extends HaBaseEntity> extends HaEntity {
  content: TeRichTextContent;

  abstract entity: T;
}
