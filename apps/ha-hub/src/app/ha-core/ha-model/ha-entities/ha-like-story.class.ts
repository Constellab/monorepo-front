import {Type} from 'class-transformer';
import { HaStory } from './ha-story.class';
import {HaAbstractLikeEntity} from './ha-abstract-like-entity.class';

export class HaLikeStory extends HaAbstractLikeEntity {
  @Type(() => HaStory)
  story: HaStory;
}
