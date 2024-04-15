import {Component, OnInit} from '@angular/core';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  HaCreateStoryDtoInput,
  HaStoryCreateDialogComponent
} from '../ha-story-create-dialog/ha-story-create-dialog.component';
import {HaStory, HaStoryDatasourcePaginated, HaStoryFilter} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {Router} from '@angular/router';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {HaTopicService} from '../../../ha-core/ha-service/ha-topic.service';
import {Observable} from 'rxjs';
import {HaTopicDto} from '../../../ha-core/ha-model/ha-entities/ha-topic.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {HaMetadataService} from '../../../ha-core/ha-service/ha-metadata.service';
import {FormControl} from '@angular/forms';
import {CoStoryCategory} from '@monorepo/community-lib';

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
    cat: CoStoryCategory.ARTICLE,
    active: false
  }, {
    cat: CoStoryCategory.DOCUMENTATION,
    active: false
  }, {
    cat: CoStoryCategory.PRODUCT_DOCUMENTATION,
    active: false
  }, {
    cat: CoStoryCategory.USE_CASE,
    active: false
  }];

  myStoriesBool: boolean = false;

  titleFormControl: FormControl<string> = new FormControl<string>('');

  constructor(private dialogService: FlDialogService,
              private router: Router,
              private storyService: HaStoryService,
              private topicService: HaTopicService,
              private metadataService: HaMetadataService) {
  }

  ngOnInit(): void {
    this.metadataService.setPageTitle('ha.stories.title');
    this.metadataService.addMetaTag('description', 'ha.stories.description');

    this.popularTopics$ = this.topicService.getPopularTopics();

    this.getStoriesFiltered();

  }

  search(): void {
    this.filters.title = this.titleFormControl.value;
    this.updateStories();
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

  getStoryImageLink(imageName?: string): string {
    if (!imageName) {
      return '';
    }
    return ClStringHelper.isHttpLink(imageName) ? imageName : this.storyService.getImageUrl(imageName);
  }

  selectTopic(topic: HaTopicDto): void {
    if(this.filters.topics .includes(topic.id)){
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
    if (this.myStoriesBool)
      this.stories = this.storyService.getMyStoriesForList();
    else
      this.stories = this.storyService.getAllPaginatedFiltered();

    this.updateStories();
  }

  private updateStories(): void {
    this.stories.getFirstPage(this.filters);
  }

  loadMoreResults(): void {
    this.stories.getNextPage();
  }

  selectMyStories(): void {
    this.myStoriesBool = !this.myStoriesBool;
    this.getStoriesFiltered();
  }
}
