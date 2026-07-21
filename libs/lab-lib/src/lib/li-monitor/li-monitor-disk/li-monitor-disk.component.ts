import { ChangeDetectionStrategy,Component, input } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { LiMonitorFreeDiskDTO } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show global information about the disk
 */
@Component({
  selector: 'li-monitor-disk',
  imports: [FlCorePipeModule, TranslatePipe],
  templateUrl: './li-monitor-disk.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './li-monitor-disk.component.scss',
})
export class LiMonitorDiskComponent {
  freeDisk = input.required<LiMonitorFreeDiskDTO>();
}
