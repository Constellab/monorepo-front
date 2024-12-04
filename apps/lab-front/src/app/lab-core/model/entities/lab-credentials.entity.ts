import { LabBaseEntityWithUser } from './lab-user.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { Expose, Type } from 'class-transformer';

export enum LabCredentialsType {
  BASIC = 'BASIC',
  S3 = 'S3',
  LAB = 'LAB',
  OTHER = 'OTHER',
}

export class LabCredentials extends LabBaseEntityWithUser {
  name: string;

  type: LabCredentialsType;

  description: string;

  toString(): string {
    return this.name;
  }
}

export type LabCredentialsDatasource<F = void> = FlDatasourcePaginated<LabCredentials, F>;

export type LabCredentialsData = Record<string, string>;

export interface LabSaveCredentialsDTO {
  name: string;

  type: LabCredentialsType;

  description: string;

  data: LabCredentialsData;
}

export class LabCredentialsDataTypeSpec {
  type: LabCredentialsType;
  specs: TdParamSpecs;
}

export class LabCredentialsDataSpecs {
  @Expose({ name: 'data_specs' })
  @Type(() => LabCredentialsDataTypeSpec)
  dataSpecs: LabCredentialsDataTypeSpec[];
}
