import {DateTime} from 'luxon';
import {FlUser} from '@monorepo/front-core-lib';

export enum CoStoryCategory {
  DOCUMENTATION = 'DOCUMENTATION',
  PRODUCT_DOCUMENTATION = 'PRODUCT_DOCUMENTATION',
  USE_CASE = 'USE_CASE',
  ARTICLE = 'ARTICLE'
}

export class CoListStoryDto {
  id: string;
  title: string;
  firstParagraph: string;
  mainPicture?: string;
  topics?: CoStoryTopic[];
  createdAt: DateTime;
  createdBy: FlUser;
  category: CoStoryCategory;
  publishedAt: DateTime;
  lastModifiedAt: DateTime;
  likes: number;
  comments: number;
}

export interface CoStoryTopic {
  id: string;
  name: string;
  popularity: number;
}
