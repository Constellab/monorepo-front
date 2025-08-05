import { HaSpace } from './ha-space.class';
import { HaUser } from './ha-user';

export enum HaSpaceUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class HaSpaceUser {
  userId: string;
  user: HaUser;
  spaceId: string;
  space: HaSpace;
  role: HaSpaceUserRole;
  active: boolean;
  createdAt: Date;
  addedBy: HaUser;
  isSpaceAdmin(): boolean {
    return this.role === HaSpaceUserRole.ADMIN;
  }
}
