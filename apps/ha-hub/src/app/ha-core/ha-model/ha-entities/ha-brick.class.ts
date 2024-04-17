import {HaEntity} from './ha-entity.class';
import {HaReferenceDTO, HaRepoType} from './ha-version.class';
import {HaBrickUser} from './ha-brick-user';
import {ClVersion} from '@monorepo/core-lib';
import {HaSpace} from './ha-space.class';
import {Type} from 'class-transformer';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CoBrick} from '@monorepo/community-lib';


export enum HaBrickVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export class HaBrick extends HaEntity implements CoBrick {
  name: string;

  description: string;

  gitRepo: string;

  pipRepo: string;

  visibility: HaBrickVisibility;

  lastVersion: ClVersion;

  brickUsers: HaBrickUser[];

  imageLink?: string;

  credentialUsername?: string;

  credentialPassword?: string;

  @Type(() => HaSpace)
  space: HaSpace;

  likes: number;

  comments: number;
}

export class HaBrickCreationDTO {
  name: string;
  description: string;
  repoGit: string;
  repoPip: string;
  version: string | ClVersion;
  repoType: HaRepoType;
  credentialUsername?: string;
  credentialPassword?: string;
  isBeta: boolean = false;
  visibility: HaBrickVisibility;
  subPatch?: number;
  technicalInfo?: Record<string, any>;
  references?: HaReferenceDTO[];
  space?: HaSpace;
  imageLink?: string;
}


export class HaEditBrickDTO {
  id: string;
  description: string;
  gitRepo: string;
  pipRepo: string;
  visibility: HaBrickVisibility;
  credentialUsername?: string;
  credentialPassword?: string;
  space?: HaSpace;
  imageLink?: string;
}

export type HaBrickDatasourcePaginated = FlDatasourcePaginated<HaBrick>;
