import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';

export enum CaRootFolderUserRole {
  OWNER = 'OWNER',
  USER = 'USER',
  VIEWER = 'VIEWER',
}

export class CaRootFolderUserRoleObj {
  constructor(private role: CaRootFolderUserRole) {}

  getRoleValue(): number {
    switch (this.role) {
      case CaRootFolderUserRole.OWNER:
        return 3;
      case CaRootFolderUserRole.USER:
        return 2;
      case CaRootFolderUserRole.VIEWER:
        return 1;
    }
  }

  canEdit(): boolean {
    return this.isHigherOrEqualThan(CaRootFolderUserRole.USER);
  }

  isOwner(): boolean {
    return this.role === CaRootFolderUserRole.OWNER;
  }

  isHigherOrEqualThan(role: CaRootFolderUserRole): boolean {
    return this.getRoleValue() >= new CaRootFolderUserRoleObj(role).getRoleValue();
  }
}

export class CaFolderUser {
  @Type(() => CaUser)
  user: CaUser;

  role: CaRootFolderUserRole;

  @Type(() => CaUser)
  sharedBy: CaUser;

  @ClLuxonDateTimeTransform()
  sharedAt: DateTime;
}

export class CaFolderUserArrayObs extends FlArrayObs<CaFolderUser> {
  protected equals(a: CaFolderUser, b: CaFolderUser): boolean {
    return a.user.id === b.user.id;
  }
}

export enum CaRootFolderNotifOptions {
  NOTIF_AND_EMAIL = 'NOTIF_AND_EMAIL',
  NOTIF_ONLY = 'NOTIF_ONLY',
  EMAIL_ONLY = 'EMAIL_ONLY',
  NONE = 'NONE',
}

/**
 * Link between folder and user that stores the notification options
 */
export class CaFolderUserConfig {
  folderNotif: CaRootFolderNotifOptions;

  messageNotif: CaRootFolderNotifOptions;

  scenarioNotif: CaRootFolderNotifOptions;

  noteNotif: CaRootFolderNotifOptions;

  documentNotif: CaRootFolderNotifOptions;
}
