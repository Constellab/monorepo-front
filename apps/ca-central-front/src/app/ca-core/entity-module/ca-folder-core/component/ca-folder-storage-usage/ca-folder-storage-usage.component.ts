import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolderStorageUsageDTO } from '../../../../model/entities/folder/ca-document.class';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { CaFolderStorageLocationUsageComponent } from '../ca-folder-storage-location-usage/ca-folder-storage-location-usage.component';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
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
