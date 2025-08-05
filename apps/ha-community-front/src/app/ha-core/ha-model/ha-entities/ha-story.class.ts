import { CoListStoryDto, CoStoryCategory } from '@monorepo/community-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { DateTime } from 'luxon';

import { HaFile } from '../../entity-module/ha-file-core/model/ha-file';
import { HaTopic } from './ha-topic.class';
import { HaUser } from './ha-user';

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

  titlePath?: string;

  storyFiles?: HaFile[];

  createdBy: HaUser;

  likes: number;

  comments: number;

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
  titlePath?: string;

  getTopics(): HaTopic[] {
    return this.topics.sort((a, b) => a.popularity - b.popularity);
  }
}

export class HaStoryFilters {
  title: string;
  topics: string[];

  constructor(title_: string) {
    this.topics = [];
    this.title = title_ ?? '';
  }
}

export type HaStoryDatasourcePaginated<F = void> = FlDatasourcePaginated<HaStory, F>;
export type HaStoryListDatasourcePaginated<F = void> = FlDatasourcePaginated<HaListStoryDto, F>;
