import {FlUser} from '@monorepo/front-core-lib';
import {DateTime} from 'luxon';
import {CoSpace} from './co-space.class';



export interface CoBrick {
  name: string;

  description?: string;

  createdBy: FlUser;

  createdAt: DateTime;

  space: CoSpace;

  imageLink?: string;
}
