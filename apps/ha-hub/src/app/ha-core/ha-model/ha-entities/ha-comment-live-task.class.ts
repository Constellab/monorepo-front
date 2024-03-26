import {CoAbstractComment} from '@monorepo/community-lib';
import {Type} from 'class-transformer';
import {HaLiveTask} from './ha-live-task.class';

export class HaCommentLiveTask extends CoAbstractComment {
  @Type(() => HaLiveTask)
  story: HaLiveTask;
}
