import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  HaCreateStoryDtoInput,
  HaStoryCreateDialogComponent
} from '../ha-story-create-dialog/ha-story-create-dialog.component';
import {
  HaStory,
  HaStoryCategory,
  HaStoryDatasourcePaginated,
  HaStoryFilter
} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {Router} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaTopicService} from '../../../ha-core/ha-service/ha-topic.service';
import {Observable} from 'rxjs';
import {HaTopicDto} from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {isPlatformBrowser} from '@angular/common';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'ha-story-list-page',
  templateUrl: './ha-story-list-page.component.html',
  styleUrls: ['./ha-story-list-page.component.scss']
})
export class HaStoryListPageComponent implements OnInit {


  stories: HaStoryDatasourcePaginated;
  popularTopics$: Observable<HaTopicDto[]>;

  filters: HaStoryFilter = new HaStoryFilter();

  categories: any[] = [{
    cat: HaStoryCategory.ARTICLE,
    active: false
  }, {
    cat: HaStoryCategory.DOCUMENTATION,
    active: false
  }, {
    cat: HaStoryCategory.PRODUCT_DOCUMENTATION,
    active: false
  }, {
    cat: HaStoryCategory.USE_CASE,
    active: false
  }];

  myStoriesBool: boolean = false;

  titleFormControl: FormControl<string> = new FormControl<string>('');

  constructor(private dialogService: FlDialogService,
              private router: Router,
              private storyService: HaStoryService,
              private topicService: HaTopicService,
              private metadataService: HaMetadataService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.stories.title');
    this.metadataService.addMetaTag('description', 'ha.stories.description');
    if(isPlatformBrowser(this.platformId)){
      this.stories = this.storyService.getAllPaginated();
      this.popularTopics$ = this.topicService.getPopularTopics();
    }
  }

  search(): void {
    this.filters.title = this.titleFormControl.value;
    this.getStoriesFiltered();
  }

  openCreateStoryDialog(): void{

    const input: HaCreateStoryDtoInput = {
      mode: 'create'
    }

    this.dialogService.openSmallDialog(HaStoryCreateDialogComponent, {data: input}).afterClosed().subscribe((story: HaStory) => {
      if (story) {
        this.router.navigate(['stories/edit/', story.id]);
      }
    });
  }

  getStoryImageLink(imageName: string): string {
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }

  selectTopic(topic: HaTopicDto): void {
    if(this.filters.topics .includes(topic.id)){
      this.filters.topics = this.filters.topics.filter((t) => t !== topic.id);
    } else {
      this.filters.topics.push(topic.id);
    }
    this.getStoriesFiltered();
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
    this.getStoriesFiltered();
  }

  getStoriesFiltered(): void {
    if (this.myStoriesBool)
      this.stories = this.storyService.getMyStoriesForList(this.filters);
    else
      this.stories = this.storyService.getAllPaginatedFiltered(this.filters);
  }

  loadMoreResults(): void {
    this.stories.getNextPage();
  }

  selectMyStories(): void {
    this.myStoriesBool = !this.myStoriesBool;
    this.getStoriesFiltered();
  }
}
