import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule, CoListFiltersComponent } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlDatasourceSortCriteria } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable } from 'rxjs';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaStoryFilters,
  HaStoryListDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaTopicDto } from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaAuthenticatedUserService } from '../../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaTopicService } from '../../../ha-core/ha-service/ha-topic.service';

@Component({
  selector: 'ha-story-list-page',
  templateUrl: './ha-story-list-page.component.html',
  styleUrls: ['./ha-story-list-page.component.scss'],
  imports: [
    FlInfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    CoCommunityLibModule,
    AsyncPipe,
    FlCorePipeModule,
    HaDetailRoutePipe,
    HaListOfItemsComponent,
    HaPageComponent,
    CoListFiltersComponent,
  ],
})
export class HaStoryListPageComponent extends HaCommunityPageDirective implements OnInit {
  private router: Router = inject(Router);
  private storyService: HaStoryService = inject(HaStoryService);
  private topicService: HaTopicService = inject(HaTopicService);
  titleFilter: string = '';

  stories: HaStoryListDatasourcePaginated<HaStoryFilters>;
  popularTopics$: Observable<HaTopicDto[]>;
  sortsCriteria: FlDatasourceSortCriteria[];
  myStories: boolean = false;
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  user = toSignal(this.authenticatedUserService.getUser());

  ngOnInit(): void {
    super.setMetaTags(
      'ha.stories.title',
      'ha.stories.description',
      null,
      HaRouterService.getFullRoute(this.router.url)
    );
    this.popularTopics$ = this.topicService.getPopularTopics();
    this.getStoriesFiltered();
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  getStoriesFiltered(): void {
    if (this.myStories) this.stories = this.storyService.getMyStoriesForList();
    else this.stories = this.storyService.getAllPaginatedFiltered();

    this.updateStories();
  }

  onMyEntitiesChanged(myEntities: boolean): void {
    this.myStories = myEntities;
    this.getStoriesFiltered();
  }

  onTitleFilterChanged(title: string): void {
    this.titleFilter = title;
    this.updateStories();
  }

  onSortsCriteriaChanged(sortsCriteria: FlDatasourceSortCriteria[]): void {
    this.sortsCriteria = sortsCriteria;
    this.updateStories();
  }

  private updateStories(): void {
    this.stories.getFirstPage(
      {
        title: this.titleFilter,
      },
      this.sortsCriteria
    );
  }
}
