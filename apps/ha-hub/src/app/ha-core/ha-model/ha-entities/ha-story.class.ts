import { HaTopic } from './ha-topic.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { HaUser } from './ha-user';
import { DateTime } from 'luxon';
import { HaFile } from '../../entity-module/ha-file-core/model/ha-file';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { CoListStoryDto, CoStoryCategory } from '@monorepo/community-lib';

export enum HaStoryStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export class HaStoryCoAuthor {
  id: string;

  user: HaUser;

  story: HaStory;
}

export class HaStory {
  id: string;
  title: string;

  @TeRichTextTransform()
  content: TeRichText;

  @TeRichTextTransform()
  contentEdition: TeRichText;

  status: HaStoryStatus;

  mainPicture?: string;

  topics: HaTopic[] = [];

  storyAuthors: HaStoryCoAuthor[];

  createdAt: DateTime;

  category: CoStoryCategory;

  publishedAt: DateTime;

  lastModifiedAt: DateTime;

  titlePath: string;

  storyFiles?: HaFile[];

  createdBy: HaUser;

  likes: number;

  comments: number;

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
    return this.storyAuthors?.map((storyAuthor) => storyAuthor.user);
  }
}

export class HaCreateStoryDto {
  title: string;

  category: CoStoryCategory;
}

export class HaListStoryDto implements CoListStoryDto {
  id: string;
  title: string;
  firstParagraph: string;
  mainPicture?: string;
  topics?: HaTopic[];
  createdAt: DateTime;
  createdBy: HaUser;
  category: CoStoryCategory;
  publishedAt: DateTime;
  lastModifiedAt: DateTime;
  likes: number;
  comments: number;

  getTopics(): HaTopic[] {
    return this.topics.sort((a, b) => a.popularity - b.popularity);
  }
}

export class HaStoryFilters {
  title: string;
  categories: string[];
  topics: string[];

  constructor() {
    this.categories = [];
    this.topics = [];
    this.title = '';
  }
}

export type HaStoryDatasourcePaginated<F = void> = FlDatasourcePaginated<HaListStoryDto, F>;
