import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolderStorageUsageDTO } from '../../../../model/entities/folder/ca-document.class';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { CaFolderStorageLocationUsageComponent } from '../ca-folder-storage-location-usage/ca-folder-storage-location-usage.component';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-storage-usage',
  templateUrl: './ca-folder-storage-usage.component.html',
  styleUrl: './ca-folder-storage-usage.component.scss',
  imports: [
    FlSectionModule,
    FlKeyValueModule,
    FlTextIconModule,
    MatIcon,
    CaFolderStorageLocationUsageComponent,
    FlIconModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaFolderStorageUsageComponent {
  @Input({ required: true }) storageUsage$: Observable<CaFolderStorageUsageDTO>;
}
