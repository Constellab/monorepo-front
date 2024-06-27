import {Component, OnInit} from '@angular/core';
import {HaConstellabHelper} from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import {HaMetadataService} from '../../ha-core/ha-service/ha-metadata.service';
import {HaRouterService} from '../../ha-core/ha-service/ha-router.service';
import {HaStoryService} from '../../ha-core/ha-service/ha-story.service';
import {HaStoryDatasourcePaginated} from '../../ha-core/ha-model/ha-entities/ha-story.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaLiveTaskDatasourcePaginated} from '../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskService} from '../../ha-core/ha-service/ha-live-task.service';
import {HaBrickDatasourcePaginated} from '../../ha-core/ha-model/ha-entities/ha-brick.class';
import {HaBrickService} from '../../ha-core/ha-service/ha-brick.service';

@Component({
  selector: 'ha-ha-home',
  templateUrl: './ha-home.component.html',
  styleUrls: ['./ha-home.component.scss']
})
export class HaHomeComponent implements OnInit {

  constellabUrl: string = HaConstellabHelper.getConstellabUrl();

  stories$: HaStoryDatasourcePaginated;
  liveTasks$: HaLiveTaskDatasourcePaginated;
  bricks$: HaBrickDatasourcePaginated;

  storyListRoute: string = HaRouterService.getStoriesListRoute();
  liveTaskListRoute: string = HaRouterService.getLiveTaskListRoute();
  brickListRoute: string = HaRouterService.getBrickListRoute();

  techDocRoute: string = HaRouterService.getTechDocRoute();
  productDocRoute: string = HaRouterService.getProductDocRoute();
  iconsRoute: string = HaRouterService.getIconsRoute();

  constructor(private metadataService: HaMetadataService,
              private storyService: HaStoryService,
              private liveTaskService: HaLiveTaskService,
              private brickService: HaBrickService) {

  }

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.home.title');
    this.metadataService.addMetaTag('description', 'ha.home.description');

    this.stories$ = this.storyService.getAllPaginatedFiltered(4);
    this.stories$.getFirstPage({spacesFilter: [], titleFilter: ''});

    this.liveTasks$ = this.liveTaskService.getAllWithFiltersPaginated(4);
    this.liveTasks$.getFirstPage({spacesFilter: [], titleFilter: ''});

    this.bricks$ = this.brickService.getAllWithFiltersPaginated(4);
    this.bricks$.getFirstPage({spacesFilter: [], titleFilter: ''});

  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId) ? imageLinkOrId : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }


}
