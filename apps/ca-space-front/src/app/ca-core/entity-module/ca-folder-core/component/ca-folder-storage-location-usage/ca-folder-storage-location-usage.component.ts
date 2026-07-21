import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { TranslatePipe } from '@ngx-translate/core';

import { CaStorageLocationUsageDTO } from '../../../../model/entities/folder/ca-document.class';

@Component({
  selector: 'ca-folder-storage-location-usage',
  templateUrl: './ca-folder-storage-location-usage.component.html',
  styleUrl: './ca-folder-storage-location-usage.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlKeyValueModule, FlCorePipeModule, TranslatePipe],
})
export class CaFolderStorageLocationUsageComponent {
  @Input({ required: true }) storageLocation: CaStorageLocationUsageDTO;

  @Input() showTotalInfo: boolean = false;
}
