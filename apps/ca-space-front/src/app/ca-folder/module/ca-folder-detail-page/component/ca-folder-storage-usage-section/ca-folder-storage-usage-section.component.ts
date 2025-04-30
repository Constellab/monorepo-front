import { Component, inject, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { CaFolderStorageUsageDTO } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { CaFolderStorageUsageComponent } from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-storage-usage/ca-folder-storage-usage.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-folder-storage-usage-section',
  templateUrl: './ca-folder-storage-usage-section.component.html',
  styleUrl: './ca-folder-storage-usage-section.component.scss',
  imports: [FlTextIconModule, MatIcon, CaFolderStorageUsageComponent, TranslatePipe],
})
export class CaFolderStorageUsageSectionComponent implements OnInit {
  private state = inject(CaFolderDetailState);
  private folderService = inject(CaFolderService);

  storageUsage$: Observable<CaFolderStorageUsageDTO>;

  ngOnInit(): void {
    this.storageUsage$ = this.state
      .getFolderId$()
      .pipe(mergeMap((folderId) => this.folderService.getFolderStorageSize(folderId)));
  }
}
