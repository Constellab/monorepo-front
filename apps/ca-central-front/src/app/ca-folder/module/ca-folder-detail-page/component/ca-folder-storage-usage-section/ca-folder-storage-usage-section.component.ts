import { Component, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { CaFolderStorageUsageDTO } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';

@Component({
  selector: 'ca-folder-storage-usage-section',
  templateUrl: './ca-folder-storage-usage-section.component.html',
  styleUrl: './ca-folder-storage-usage-section.component.scss',
})
export class CaFolderStorageUsageSectionComponent implements OnInit {
  storageUsage$: Observable<CaFolderStorageUsageDTO>;

  constructor(
    private state: CaFolderDetailState,
    private folderService: CaFolderService
  ) {}

  ngOnInit(): void {
    this.storageUsage$ = this.state
      .getFolderId$()
      .pipe(mergeMap((folderId) => this.folderService.getFolderStorageSize(folderId)));
  }
}
