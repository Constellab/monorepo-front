import { Component, Input } from '@angular/core';
import { CaStorageLocationUsageDTO } from '../../../../model/entities/folder/ca-document.class';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-storage-location-usage',
  templateUrl: './ca-folder-storage-location-usage.component.html',
  styleUrl: './ca-folder-storage-location-usage.component.scss',
  imports: [FlKeyValueModule, FlCorePipeModule, TranslatePipe],
})
export class CaFolderStorageLocationUsageComponent {
  @Input({ required: true }) storageLocation: CaStorageLocationUsageDTO;

  @Input() showTotalInfo: boolean = false;
}
