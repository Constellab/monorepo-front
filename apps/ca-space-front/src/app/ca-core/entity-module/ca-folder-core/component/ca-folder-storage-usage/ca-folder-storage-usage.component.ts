import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaFolderStorageUsageDTO } from '../../../../model/entities/folder/ca-document.class';
import { CaFolderStorageLocationUsageComponent } from '../ca-folder-storage-location-usage/ca-folder-storage-location-usage.component';

@Component({
  selector: 'ca-folder-storage-usage',
  templateUrl: './ca-folder-storage-usage.component.html',
  styleUrl: './ca-folder-storage-usage.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
