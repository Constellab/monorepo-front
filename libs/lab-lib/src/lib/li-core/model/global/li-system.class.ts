import { Expose, Type } from 'class-transformer';

import { LiMonitorFreeDiskDTO } from '../entities/li-monitor.entity';

export class LiLab {
  id: string;
  name: string;

  @Expose({ name: 'is_current_lab' })
  isCurrentLab: boolean;

  @Expose({ name: 'space_id' })
  spaceId?: string;

  @Expose({ name: 'space_name' })
  spaceName?: string;
}

export class LiSystemInfo {
  @Type(() => LiLab)
  lab: LiLab;

  @Expose({ name: 'front_version' })
  frontVersion: string;
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

  @Expose({ name: 'has_start_error' })
  hasStartError: boolean;
}

export class LiStartLogFileObject {
  progress: Record<string, any>;

  @Expose({ name: 'main_errors' })
  mainErrors: string[];

  errors: string[];
}
