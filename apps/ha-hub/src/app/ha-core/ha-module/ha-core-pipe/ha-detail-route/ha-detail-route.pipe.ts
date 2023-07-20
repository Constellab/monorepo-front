import {Pipe, PipeTransform} from '@angular/core';
import {HaStory} from '../../../ha-model/ha-entities/ha-story.class';
import {HaRouterService} from '../../../ha-service/ha-router.service';


@Pipe({
  name: 'haDetailRoute',
})
export class HaDetailRoutePipe implements PipeTransform {

  transform(value: any): string {
    if (value instanceof HaStory) {
      return HaRouterService.getStoryRoute(value.id, value.titlePath);
    }

    return null;
  }
}
