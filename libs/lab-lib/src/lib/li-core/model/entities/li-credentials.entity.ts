import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { LiBaseEntityWithUser } from './li-user.entity';
import { TdParamSpecs } from '@monorepo/technical-doc';

export enum LiCredentialsType {
  BASIC = 'BASIC',
  S3 = 'S3',
  LAB = 'LAB',
  OTHER = 'OTHER',
}

export class LiCredentials extends LiBaseEntityWithUser {
  name: string;

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

  type: LiCredentialsType;

  description: string;

  data: LiCredentialsData;
}

export class LiCredentialsDataTypeSpec {
  type: LiCredentialsType;
  specs: TdParamSpecs;
}

export class LiCredentialsDataSpecs {
  @Expose({ name: 'data_specs' })
  @Type(() => LiCredentialsDataTypeSpec)
  dataSpecs: LiCredentialsDataTypeSpec[];
}
