import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoCommunityLibModule, CoStoryCategory } from '@monorepo/community-lib';
import { ClStringHelper } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { Observable } from 'rxjs';

import { HaListOfItemsComponent } from '../../../ha-core/ha-component/ha-list-of-items/ha-list-of-items.component';
import { HaPageComponent } from '../../../ha-core/ha-component/ha-page/ha-page.component';
import {
  HaStory,
  HaStoryFilters,
  HaStoryListDatasourcePaginated,
} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { HaTopicDto } from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import { HaCommunityPageDirective } from '../../../ha-core/ha-module/ha-core-directive/ha-community-page/ha-community-page.directive';
import { HaDetailRoutePipe } from '../../../ha-core/ha-module/ha-core-pipe/ha-detail-route/ha-detail-route.pipe';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaTopicService } from '../../../ha-core/ha-service/ha-topic.service';
import {
  HaCreateStoryDtoInput,
  HaStoryCreateDialogComponent,
} from '../ha-story-create-dialog/ha-story-create-dialog.component';

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
  ],
})
export class HaStoryListPageComponent extends HaCommunityPageDirective implements OnInit {
  private dialogService: FlDialogService = inject(FlDialogService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private storyService: HaStoryService = inject(HaStoryService);
  private topicService: HaTopicService = inject(HaTopicService);

  stories: HaStoryListDatasourcePaginated<HaStoryFilters>;
  popularTopics$: Observable<HaTopicDto[]>;

  filters: HaStoryFilters = new HaStoryFilters(this.route.snapshot.queryParams.titleFilter);

  categories: any[] = [
    {
      cat: CoStoryCategory.ARTICLE,
      active: false,
    },
    {
      cat: CoStoryCategory.DOCUMENTATION,
      active: false,
    },
    {
      cat: CoStoryCategory.PRODUCT_DOCUMENTATION,
      active: false,
    },
    {
      cat: CoStoryCategory.USE_CASE,
      active: false,
    },
  ];

  myStoriesBool: boolean = false;

  titleFormControl: FormControl<string> = new FormControl<string>('');

  ngOnInit(): void {
    super.setMetaTags(
      'ha.stories.title',
      'ha.stories.description',
      null,
      HaRouterService.getFullRoute(this.router.url)
    );
    this.popularTopics$ = this.topicService.getPopularTopics();
    this.titleFormControl.patchValue(this.filters.title);
    this.getStoriesFiltered();
  }

  search(): void {
    if (this.titleFormControl.value == null || this.titleFormControl.value == '') {
      this.router.navigate([], { relativeTo: this.route });
    } else {
      this.router.navigate([], {
        queryParams: { titleFilter: this.titleFormControl.value },
        relativeTo: this.route,
      });
    }
    this.filters.title = this.titleFormControl.value;
    this.updateStories();
  }

  openCreateStoryDialog(): void {
    const input: HaCreateStoryDtoInput = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(HaStoryCreateDialogComponent, { data: input })
      .afterClosed()
      .subscribe((story: HaStory) => {
        if (story) {
          this.router.navigate(['stories/edit/', story.id]);
        }
      });
  }

  getStoryImageLink(storyId: string, imageLinkOrId?: string): string {
    if (!imageLinkOrId) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageLinkOrId)
      ? imageLinkOrId
      : this.storyService.getImageUrl(storyId, imageLinkOrId);
  }

  selectTopic(topic: HaTopicDto): void {
    if (this.filters.topics.includes(topic.id)) {
      this.filters.topics = this.filters.topics.filter((t) => t !== topic.id);
    } else {
      this.filters.topics.push(topic.id);
    }
    this.updateStories();
  }

  isSelected(topic: HaTopicDto): boolean {
    return this.filters.topics.find((id) => id === topic.id) != null;
  }

  getStoriesFiltered(): void {
    if (this.myStoriesBool) this.stories = this.storyService.getMyStoriesForList();
    else this.stories = this.storyService.getAllPaginatedFiltered();

    this.updateStories();
  }

  private updateStories(): void {
    this.stories.getFirstPage(this.filters);
  }

  selectMyStories(): void {
    this.myStoriesBool = !this.myStoriesBool;
    this.getStoriesFiltered();
  }
}
