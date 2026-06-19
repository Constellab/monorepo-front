import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';

import { LiBaseEntityWithUser } from './li-user.entity';

export class LiCredentialsType {
  type: string;

  @Expose({ name: 'brick_name' })
  brickName: string;

  @Expose({ name: 'human_name' })
  humanName: string;

  @Expose({ name: 'short_description' })
  shortDescription: string | null;

  toString(): string {
    return this.humanName;
  }
}

export class LiCredentials extends LiBaseEntityWithUser {
  name: string;

  @Type(() => LiCredentialsType)
  type: LiCredentialsType;

  description: string;

  toString(): string {
    return this.name;
  }
}

export type LiCredentialsDatasource<F = void> = FlDatasourcePaginated<LiCredentials, F>;

export type LiCredentialsData = Record<string, string>;

export interface LiSaveCredentialsDTO {
  name: string;

  type: string;

  description: string;

  data: LiCredentialsData;
}

export class LiCredentialsDataTypeSpec extends LiCredentialsType {
  specs: TdParamSpecs;
}

export class LiCredentialsDataSpecs {
  @Expose({ name: 'data_specs' })
  @Type(() => LiCredentialsDataTypeSpec)
  dataSpecs: LiCredentialsDataTypeSpec[];
}
