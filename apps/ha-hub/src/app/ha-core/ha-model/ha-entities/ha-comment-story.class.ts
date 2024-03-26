import {CoAbstractComment} from '@monorepo/community-lib';
import {Type} from 'class-transformer';
import {HaStory} from './ha-story.class';

export class HaCommentStory extends CoAbstractComment{
  @Type(() => HaStory)
  story: HaStory;
}
