import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiFolderObject } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'li-object-sync-info',
  templateUrl: './li-object-sync-info.component.html',
  styleUrls: ['./li-object-sync-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, FlUserModule, FlTextIconModule, TranslatePipe],
})
export class LiObjectSyncInfoComponent {
  @Input() object: LiFolderObject;
}
