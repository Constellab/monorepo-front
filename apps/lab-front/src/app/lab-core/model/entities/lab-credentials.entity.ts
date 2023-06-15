import {LabBaseEntityWithUser} from './lab-user.entity';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';


export enum LabCredentialsType {
  BASIC = 'BASIC',
  S3 = 'S3',
  OTHER = 'OTHER'
}

export class LabCredentials extends LabBaseEntityWithUser {

  name: string;

  type: LabCredentialsType;

  description: string;

  toString(): string {
    return this.name;
  }
}

export type LabCredentialsDatasource = FlDatasourcePaginated<LabCredentials>;

export type LabCredentialsData = Record<string, string>;

export interface LabSaveCredentialsDTO {
  name: string;

  type: LabCredentialsType;

  description: string;

  data: LabCredentialsData;
}

export interface LabCredentialsDataS3 {
  endpoint_url: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
  bucket?: string;
}

export interface LabCredentialsDataBasic {
  username: string;
  password: string;
  url?: string;
}
