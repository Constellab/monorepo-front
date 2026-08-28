import { ClVersion } from '@monorepo/core-lib';

import { HaEntity } from './ha-entity.class';

export enum HaRepoType {
  PIP = 'PIP',
  GIT = 'GIT',
}

export enum HaVersionType {
  NORMAL = 'NORMAL',
  BETA = 'BETA',
}

export class HaVersion extends HaEntity {
  version: string;
}

export class HaNewVersionDTO {
  brickName: string;

  version: string;

  repoType: HaRepoType;

  isBeta: boolean = false;

  subPatch?: number;

  technicalInfo?: Record<string, any>;

  references?: HaReferenceDTO[];
}

export interface HaBrickSettingsDTO {
  name: string;
  version: string;
  author?: string;
  variables?: Record<string, any>;
  technical_info?: Record<string, any>;
  environment: HaEnvironmentDTO;
}

export class HaAddVersionInput {
  isNew: boolean;
  name: string;
  version: string;
  brickVersionReferences: HaReferenceDTO[];
  technicalInfo: Record<string, any>;
  isBeta: boolean;
  subPatch?: number | null;

  constructor(
    isNew: boolean,
    name: string,
    version: string,
    environment: HaEnvironmentDTO,
    technicalInfo: Record<string, any>
  ) {
    this.isNew = isNew;
    this.name = name;
    this.version = version;
    const clVersion: ClVersion = ClVersion.fromString(version);
    this.isBeta = clVersion.isBeta();
    if (this.isBeta) {
      this.subPatch = clVersion.subPatch;
    }
    this.technicalInfo = technicalInfo;
    this.brickVersionReferences = HaAddVersionInput.getBrickReferences(environment);
  }

  /**
   * Every brick the environment references: the explicit brick list first, then the bricks
   * found among the pip and git packages.
   */
  private static getBrickReferences(environment: HaEnvironmentDTO): HaReferenceDTO[] {
    const references: HaReferenceDTO[] = [];
    for (const brick of environment.bricks ?? []) {
      references.push({ name: brick.name, version: brick.version });
    }
    references.push(...HaAddVersionInput.getBrickPackages(environment.pip));
    references.push(...HaAddVersionInput.getBrickPackages(environment.git));
    return references;
  }

  private static getBrickPackages(sources: HaRepoTypeNewVersionDTO[]): HaReferenceDTO[] {
    const references: HaReferenceDTO[] = [];
    for (const source of sources ?? []) {
      for (const dependency of source.packages) {
        if (dependency.is_brick) {
          references.push({ name: dependency.name, version: dependency.version });
        }
      }
    }
    return references;
  }
}

export interface HaReferenceDTO {
  name: string;
  version: string;
  referenceState?: HaBrickVersionReferenceState;
}

export interface HaNewVersionFile {
  name: string;
  version: string;
  technical_info: Record<string, any>;
  environment: HaEnvironmentDTO;
}

export enum HaBrickVersionReferenceState {
  DIRECT = 'DIRECT',
  INDIRECT = 'INDIRECT',
}

export interface HaImportReferenceDTO {
  name: string;
  version: string;
  is_brick?: boolean;
}

export interface HaEnvironmentDTO {
  pip: HaRepoTypeNewVersionDTO[];
  git: HaRepoTypeNewVersionDTO[];
  bricks?: HaImportReferenceDTO[];
}

export interface HaRepoTypeNewVersionDTO {
  source: string;
  packages: HaImportReferenceDTO[];
}
