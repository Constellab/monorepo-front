import {Pipe, PipeTransform} from '@angular/core';
import {HaStory} from '../../../ha-model/ha-entities/ha-story.class';
import {HaRouterService} from '../../../ha-service/ha-router.service';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaLiveTask} from '../../../ha-model/ha-entities/ha-live-task.class';
import {HaBrick} from '../../../ha-model/ha-entities/ha-brick.class';


@Pipe({
  name: 'haDetailRoute',
})
export class HaDetailRoutePipe implements PipeTransform {

  transform(value: any): string {
    if (value instanceof HaStory) {
      return HaRouterService.getStoryRoute(value.id, ClStringHelper.getCleanUrlPath(value.titlePath))+'azeazeaz';
    }

    if (value instanceof HaLiveTask) {
      return HaRouterService.getLiveTaskRoute(value.id, ClStringHelper.getCleanUrlPath(value.title));
    }

    if (value instanceof HaBrick) {
      return HaRouterService.getBrickPageRoute(value.name);
    }

    return null;
  }
}
