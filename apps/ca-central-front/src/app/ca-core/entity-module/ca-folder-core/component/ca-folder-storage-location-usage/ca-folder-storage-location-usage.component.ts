import { Component, Input } from '@angular/core';
import { CaStorageLocationUsageDTO } from '../../../../model/entities/folder/ca-document.class';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
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
