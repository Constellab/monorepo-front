import {HaEntity} from './ha-entity.class';
import {HaReferenceDTO, HaRepoType} from './ha-version.class';
import {HaBrickUser} from './ha-brick-user';
import {ClVersion} from '@monorepo/core-lib';

export enum HaBrickVisibility {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export class HaBrick extends HaEntity {
  name: string;

  description: string;

  isCertified: boolean;

  gitRepo: string;

  pipRepo: string;

  visibility: HaBrickVisibility;

  lastVersion: ClVersion;

  brickUsers: HaBrickUser[];

  imageLink?: string;

  credentialUsername?: string;

  credentialPassword?: string;
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

  constructor(name: string, version: string, technicalInfo: Record<string, any>, references: HaReferenceDTO[]) {
    this.name = name;
    this.version = version;
    this.technicalInfo = technicalInfo;
    this.references = references;
    this.description = '';
    this.repoType = HaRepoType.PIP;
    this.subPatch = 0;
    this.repoGit = '';
    this.repoPip = '';
    this.visibility = HaBrickVisibility.PUBLIC;
  }
}


export class HaEditBrickDTO {
  id: string;
  description: string;
  gitRepo: string;
  pipRepo: string;
  visibility: HaBrickVisibility;
  credentialUsername?: string;
  credentialPassword?: string;
}
