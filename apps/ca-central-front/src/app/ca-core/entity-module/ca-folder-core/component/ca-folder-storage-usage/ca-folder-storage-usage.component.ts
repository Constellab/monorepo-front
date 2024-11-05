import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CaFolderStorageUsageDTO } from '../../../../model/entities/folder/ca-document.class';

@Component({
  selector: 'ca-folder-storage-usage',
  templateUrl: './ca-folder-storage-usage.component.html',
  styleUrl: './ca-folder-storage-usage.component.scss',
})
export class CaFolderStorageUsageComponent {
  @Input({ required: true }) storageUsage$: Observable<CaFolderStorageUsageDTO>;
}
