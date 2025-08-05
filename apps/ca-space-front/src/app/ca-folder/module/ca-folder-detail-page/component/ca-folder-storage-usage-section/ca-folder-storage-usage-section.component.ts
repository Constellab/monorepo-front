import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaFolderStorageUsageComponent } from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-storage-usage/ca-folder-storage-usage.component';
import { CaFolderStorageUsageDTO } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';

@Component({
  selector: 'ca-folder-storage-usage-section',
  templateUrl: './ca-folder-storage-usage-section.component.html',
  styleUrl: './ca-folder-storage-usage-section.component.scss',
  imports: [FlTextIconModule, MatIcon, CaFolderStorageUsageComponent, TranslatePipe],
})
export class CaFolderStorageUsageSectionComponent implements OnInit {
  @Input({ required: true }) folderId: string;

  private folderService = inject(CaFolderService);

  storageUsage$: Observable<CaFolderStorageUsageDTO>;

  ngOnInit(): void {
    this.storageUsage$ = this.folderService.getFolderStorageSize(this.folderId);
  }
}
