import { Component, OnInit } from '@angular/core';
import { FlDialogService, FlTranslateService } from '@monorepo/front-core-lib';
import {
  HaCreateStoryDtoInput,
  HaStoryCreateDialogComponent,
} from '../ha-story-create-dialog/ha-story-create-dialog.component';
import {
  HaStory,
  HaStoryDatasourcePaginated,
  HaStoryFilters,
} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import { ActivatedRoute, Router } from '@angular/router';
import { HaStoryService } from '../../../ha-core/ha-service/ha-story.service';
import { HaTopicService } from '../../../ha-core/ha-service/ha-topic.service';
import { Observable } from 'rxjs';
import { HaTopicDto } from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import { ClStringHelper } from '@monorepo/core-lib';
import { HaMetadataService } from '../../../ha-core/ha-service/ha-metadata.service';
import { FormControl } from '@angular/forms';
import { CoStoryCategory } from '@monorepo/community-lib';
import { HaCommunityPage } from '../../../ha-core/utils/ha-community.page';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-story-list-page',
  templateUrl: './ha-story-list-page.component.html',
  styleUrls: ['./ha-story-list-page.component.scss'],
})
export class HaStoryListPageComponent extends HaCommunityPage implements OnInit {
  stories: HaStoryDatasourcePaginated<HaStoryFilters>;
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

  constructor(
    private dialogService: FlDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private storyService: HaStoryService,
    private topicService: HaTopicService,
    translateService: FlTranslateService,
    metadataService: HaMetadataService
  ) {
    super(translateService, metadataService);
  }

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

  changeSelectState(event: any): void {
    this.categories = this.categories.map((cat) => {
      if (cat.cat === event.cat) {
        cat.active = !cat.active;
        if (cat.active) {
          this.filters.categories.push(cat.cat);
        } else {
          this.filters.categories = this.filters.categories.filter((c) => c !== cat.cat);
        }
      }
      return cat;
    });
    this.updateStories();
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
