import { Expose, Type } from 'class-transformer';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { LabBaseEntity } from '../global/lab-entity.entity';

export class LabMonitorData {
  @Expose({ name: 'all_cpu_percent' })
  allCpuPercent: number[];
}

export class LabMonitor extends LabBaseEntity {
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
  @Type(() => LabMonitorData)
  data: LabMonitorData;
}

export class LabMonitorGraphicsBetweenDates {
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

export class LabMonitorFreeDiskDTO {
  @Expose({ name: 'required_disk_free_space' })
  requiredDiskFreeSpace: number;

  @Expose({ name: 'disk_usage_free' })
  diskUsageFree: number;
}

export class LabCurrentMonitorDTO {
  @Expose({ name: 'monitor' })
  @Type(() => LabMonitor)
  monitor: LabMonitor;

  @Expose({ name: 'free_disk' })
  @Type(() => LabMonitorFreeDiskDTO)
  freeDisk: LabMonitorFreeDiskDTO;
}
