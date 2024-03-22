import {HaTopic,} from './ha-topic.class';
import {FlDatasourcePaginated, FlEntity} from '@monorepo/front-core-lib';
import {HaUser} from './ha-user';
import {DateTime} from 'luxon';
import {HaFile} from './ha-file';
import {TeRichTextContent} from '@monorepo/text-editor';
import {CoListStoryDto, CoStoryCategory} from '@monorepo/community-lib';

export enum HaStoryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export class HaStoryAuthor {
  id: string;

  user: HaUser;

  story: HaStory;
}

export class HaStory {
  id: string;
  title: string;
  content: TeRichTextContent;
  contentEdition: TeRichTextContent;

  status: HaStoryStatus;

  mainPicture?: string;

  topics: HaTopic[] = [];

  storyAuthors: HaStoryAuthor[];

  createdAt: DateTime;

  category: CoStoryCategory;

  publishedAt: DateTime;

  lastModifiedAt: DateTime;

  titlePath: string;

  storyFiles: HaFile[];

  createdBy: HaUser;

  likes: number;

  init(story: HaStory): void {
    Object.assign(this, story);
  }

  getTopics(): HaTopic[] {
    return this.topics.sort((a, b) => a.popularity - b.popularity);
  }


  getAuthor(): HaUser {
    return this.createdBy;
  }

  getCoAuthors(): HaUser[] {
    console.log(this.storyAuthors)
    return this.storyAuthors?.map(storyAuthor => storyAuthor.user);
  }
}

export class HaCreateStoryDto {
  title: string;

  category: CoStoryCategory;

}

export class HaListStoryDto implements CoListStoryDto{
  id: string;
  title: string;
  firstParagraph: string;
  mainPicture?: string;
  topics?: HaTopic[];
  createdAt: DateTime;
  createdBy: HaUser
  category: CoStoryCategory;
  publishedAt: DateTime;
  lastModifiedAt: DateTime;
  likes: number;

  getTopics(): HaTopic[] {
    return this.topics.sort((a, b) => a.popularity - b.popularity);
  }

}

export class HaStoryDataSourceDataDto {
  id: string;
  title: string;

  category: CoStoryCategory;

  status: HaStoryStatus;
  createdAt: DateTime;

  storyAuthors: HaStoryAuthor[];

  publishedAt: DateTime;
  lastModifiedAt: DateTime;

  topics?: HaTopic[];

  createdBy: HaUser;

  getTopics(): HaTopic[] {
    return this.topics.sort((a, b) => a.popularity - b.popularity);
  }


  getAuthor(): HaUser {
    return this.createdBy;
  }
}

export class HaStoryFilter {
  title: string;
  categories: string[];
  topics: string[];

  constructor() {
    this.categories = [];
    this.topics = [];
    this.title = '';
  }
}

export type HaStoryDatasourcePaginated = FlDatasourcePaginated<HaListStoryDto>;

export type HaMyStoriesDataSource = FlDatasourcePaginated<HaStoryDataSourceDataDto>;

export class HaStoryContentFormDTO implements FlEntity {
  id: string;
  contentEdition: TeRichTextContent;
  category: CoStoryCategory;
}
