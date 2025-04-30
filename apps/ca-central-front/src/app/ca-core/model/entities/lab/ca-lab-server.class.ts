import { Type } from 'class-transformer';

export type CaServerInstanceStatus = 'CREATING' | 'RUNNING' | 'RESTARTING' | 'STOPPED' | 'STOPPING';
export type CaServerVolumeStatus = 'CREATING' | 'AVAILABLE' | 'IN_USE' | 'ATTACHING';
export type CaServerVolumeType = 'CLASSIC' | 'HIGH_SPEED';
export type CaServerBillingType = 'HOURLY' | 'MONTHLY';

export interface CaInstanceStatusObject {
  status: CaServerInstanceStatus;
  message?: string;
}

export class CaServerInstance {
  id: string;
  status: CaInstanceStatusObject;
  // complete object of the cloud provider
  originalObject: any;
  region: string;
  billing: CaServerBillingType;
}

export class CaServerVolume {
  id: string;
  status: CaServerVolumeStatus;
  region: string;
  size: number; // In GB
  type: CaServerVolumeType;
  // complete object of the cloud provider
  originalObject: any;
}

export class CaOvhDomainRecord {
  id: string;
  zone: string;
  subDomain: string;
  target: string;
  fieldType: string;
  ttl: number;
}

export class CaIpAddress {
  id: string;
  ipAddress: string;
  region: string;
  // complete object of the cloud provider
  originalObject: any;
}

export class CaServerCompleteInfo {
  @Type(() => CaServerInstance)
  instance: CaServerInstance;

  @Type(() => CaServerVolume)
  volume: CaServerVolume;

  @Type(() => CaIpAddress)
  ipAddress?: CaIpAddress;

  @Type(() => CaOvhDomainRecord)
  domainRecord: CaOvhDomainRecord;
}
