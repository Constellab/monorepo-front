import { Component, inject, signal } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LiDiskFolderSizesDTO, LiMonitorService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-folder-sizes-dialog',
  templateUrl: './li-folder-sizes-dialog.component.html',
  styleUrls: ['./li-folder-sizes-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlKeyValueModule,
    FlCorePipeModule,
    TranslatePipe,
    FlLoaderModule,
    MatTableModule,
  ],
})
export class LiFolderSizesDialogComponent {
  isLoading = signal(true);
  folderSizes = signal<LiDiskFolderSizesDTO | null>(null);

  displayedColumns = ['prettyName', 'size', 'path', 'error'];

  constructor() {
    inject(LiMonitorService)
      .getFolderSizes()
      .subscribe((result) => {
        this.folderSizes.set(result);
        this.isLoading.set(false);
      });
  }
}
