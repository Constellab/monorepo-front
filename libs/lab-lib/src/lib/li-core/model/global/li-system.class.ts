import { Expose, Type } from 'class-transformer';

import { LiMonitorFreeDiskDTO } from '../entities/li-monitor.entity';

export class LiSpace {
  id: string;
  name: string;
  domain: string;
  photo?: string;
}

export class LiSystemInfo {
  @Expose({ name: 'lab_name' })
  labName: string;

  @Expose({ name: 'front_version' })
  frontVersion: string;

  @Type(() => LiSpace)
  space: LiSpace;

  id: string;
}

export class LiPipPackage {
  name: string;
  version: string;
}

export class LiSystemConfig {
  python_version: string;
  pip_packages: LiPipPackage[];
}

export class LiSystemStatus {
  @Expose({ name: 'free_disk' })
  @Type(() => LiMonitorFreeDiskDTO)
  freeDisk: LiMonitorFreeDiskDTO;
}
