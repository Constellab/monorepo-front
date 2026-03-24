import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Expose } from 'class-transformer';

export enum LiLabMode {
  PROD = 'prod',
  DEV = 'dev',
}

export enum LiLabEnvironment {
  ON_CLOUD = 'ON_CLOUD',
  DESKTOP = 'DESKTOP',
  LOCAL = 'LOCAL',
}

export class LiLab {
  id: string; // Id of the model

  @Expose({ name: 'lab_id' })
  labId: string; // Id of the lab

  name: string;

  @Expose({ name: 'is_current_lab' })
  isCurrentLab: boolean;

  @Expose({ name: 'space_id' })
  spaceId?: string;

  @Expose({ name: 'space_name' })
  spaceName?: string;

  mode: LiLabMode;

  environment: LiLabEnvironment;

  domain?: string;

  @Expose({ name: 'front_url' })
  frontUrl?: string;

  @Expose({ name: 'credentials_id' })
  credentialsId?: string;

  toString(): string {
    return this.name + (this.mode === LiLabMode.DEV ? ' (dev)' : '');
  }
}

export type LiLabDatasource<F = void> = FlDatasourcePaginated<LiLab, F>;
