import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';

import { LiBaseEntity } from '../global/li-entity.entity';

export class LiMonitorData {
  @Expose({ name: 'all_cpu_percent' })
  allCpuPercent: number[];
}

export class LiMonitor extends LiBaseEntity {
  @Expose({ name: 'cpu_count' })
  cpuCount: number;

  @Expose({ name: 'cpu_percent' })
  cpuPercent: number;

  @Expose({ name: 'disk_total' })
  diskTotal: number;

  @Expose({ name: 'disk_usage_used' })
  diskUsageUsed: number;

  @Expose({ name: 'disk_usage_free' })
  diskUsageFree: number;

  @Expose({ name: 'disk_usage_percent' })
  diskUsagePercent: number;

  @Expose({ name: 'swap_memory_total' })
  swapMemoryTotal: number;

  @Expose({ name: 'swap_memory_used' })
  swapMemoryUsed: number;

  @Expose({ name: 'swap_memory_free' })
  swapMemoryFree: number;

  @Expose({ name: 'swap_memory_percent' })
  swapMemoryPercent: number;

  @Expose({ name: 'net_io_bytes_sent' })
  netIoBytesSent: number;

  @Expose({ name: 'net_io_bytes_recv' })
  netIoBytesRecv: number;

  @Expose({ name: 'ram_usage_total' })
  ramUsageTotal: number;

  @Expose({ name: 'ram_usage_used' })
  ramUsageUsed: number;

  @Expose({ name: 'ram_usage_free' })
  ramUsageFree: number;

  @Expose({ name: 'ram_usage_percent' })
  ramUsagePercent: number;

  // GPU
  @Expose({ name: 'gpu_percent' })
  gpuPercent: number;

  @Expose({ name: 'gpu_temperature' })
  gpuTemperature: number;

  @Expose({ name: 'gpu_memory_total' })
  gpuMemoryTotal: number;

  @Expose({ name: 'gpu_memory_used' })
  gpuMemoryUsed: number;

  @Expose({ name: 'gpu_memory_free' })
  gpuMemoryFree: number;

  @Expose({ name: 'gpu_memory_percent' })
  gpuMemoryPercent: number;

  @Expose({ name: 'gpu_enabled' })
  gpuEnabled: boolean;

  @Expose({ name: 'data' })
  @Type(() => LiMonitorData)
  data: LiMonitorData;
}

export class LiMonitorGraphicsBetweenDates {
  @Expose({ name: 'from_date' })
  @ClLuxonDateTimeTransform()
  fromDate: Date;

  @Expose({ name: 'to_date' })
  @ClLuxonDateTimeTransform()
  toDate: Date;

  @Expose({ name: 'main_figure' })
  mainFigure?: any;

  @Expose({ name: 'cpu_figure' })
  cpuFigure?: any;

  @Expose({ name: 'network_figure' })
  networkFigure?: any;

  @Expose({ name: 'gpu_figure' })
  gpuFigure?: any;

  @Expose({ name: 'gpu_enabled' })
  gpuEnabled: boolean;
}

export class LiMonitorFreeDiskDTO {
  @Expose({ name: 'required_disk_free_space' })
  requiredDiskFreeSpace: number;

  @Expose({ name: 'disk_usage_free' })
  diskUsageFree: number;
}

export class LiCurrentMonitorDTO {
  @Expose({ name: 'monitor' })
  @Type(() => LiMonitor)
  monitor: LiMonitor;

  @Expose({ name: 'free_disk' })
  @Type(() => LiMonitorFreeDiskDTO)
  freeDisk: LiMonitorFreeDiskDTO;
}

export class LiFolderSizeDTO {
  @Expose({ name: 'path' })
  path: string;

  @Expose({ name: 'name' })
  name: string;

  @Expose({ name: 'pretty_name' })
  prettyName: string;

  @Expose({ name: 'size' })
  size: number | null;

  @Expose({ name: 'error' })
  error: string | null;
}

export class LiDiskFolderSizesDTO {
  @Expose({ name: 'folders' })
  @Type(() => LiFolderSizeDTO)
  folders: LiFolderSizeDTO[];

  @Expose({ name: 'total_size' })
  totalSize: number;
}

export class LiUploadSpaceCheckDTO {
  @Expose({ name: 'has_enough_space' })
  hasEnoughSpace: boolean;

  @Expose({ name: 'file_size' })
  fileSize: number;

  @Expose({ name: 'required_disk_free_space' })
  requiredDiskFreeSpace: number;

  @Expose({ name: 'disk_usage_free' })
  diskUsageFree: number;

  @Expose({ name: 'remaining_space_after_file' })
  remainingSpaceAfterFile: number;
}
