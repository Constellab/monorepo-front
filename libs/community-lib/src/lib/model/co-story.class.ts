import { DateTime } from 'luxon';

import { CoUser } from './co-user.class';

export enum CoStoryCategory {
  DOCUMENTATION = 'DOCUMENTATION',
  PRODUCT_DOCUMENTATION = 'PRODUCT_DOCUMENTATION',
  USE_CASE = 'USE_CASE',
  ARTICLE = 'ARTICLE',
}

export class CoListStoryDto {
  id: string;
  title: string;
  firstParagraph: string;
  mainPicture?: string;
  createdAt: DateTime;
  createdBy: CoUser;
  category: CoStoryCategory;
  publishedAt: DateTime;
  lastModifiedAt: DateTime;
  likes: number;
  comments: number;
}
