import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'fl-last-sync-info',
  templateUrl: './fl-last-sync-info.component.html',
  styleUrls: ['./fl-last-sync-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlLastSyncInfoComponent {
  @Input() lastSyncBy: string;

  @Input() lastSyncAt: DateTime;
}
