import {DateTime} from 'luxon';
import {CoSpace} from './co-space.class';
import {CoUser} from './co-user.class';


export interface CoBrick {
  name: string;

  description?: string;

  createdBy: CoUser;

  createdAt: DateTime;

  space: CoSpace;

  imageLink?: string;

  likes: number;

  comments: number;
}
