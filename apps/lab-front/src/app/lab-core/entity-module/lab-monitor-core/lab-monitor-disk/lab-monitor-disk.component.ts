import { Component, input } from '@angular/core';
import { LabMonitorFreeDiskDTO } from '../../../model/entities/lab-monitor.entity';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show global information about the disk
 */
@Component({
  selector: 'lab-monitor-disk',
  imports: [FlCorePipeModule, TranslatePipe],
  templateUrl: './lab-monitor-disk.component.html',
  styleUrl: './lab-monitor-disk.component.scss',
})
export class LabMonitorDiskComponent {
  freeDisk = input.required<LabMonitorFreeDiskDTO>();
}
