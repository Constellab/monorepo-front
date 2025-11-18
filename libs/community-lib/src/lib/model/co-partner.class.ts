import { DateTime } from 'luxon';

import { CoUser } from './co-user.class';

export interface CoPartner {
  id: string;

  createdAt: DateTime;

  certified: boolean;

  name: string;

  logo?: string;

  likes: number;

  comments: number;

  user: CoUser;
}
