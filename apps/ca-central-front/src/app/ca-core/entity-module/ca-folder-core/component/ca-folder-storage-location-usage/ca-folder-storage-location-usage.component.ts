import { Component, Input } from '@angular/core';
import { CaStorageLocationUsageDTO } from '../../../../model/entities/folder/ca-document.class';

@Component({
  selector: 'ca-folder-storage-location-usage',
  templateUrl: './ca-folder-storage-location-usage.component.html',
  styleUrl: './ca-folder-storage-location-usage.component.scss',
})
export class CaFolderStorageLocationUsageComponent {
  @Input({ required: true }) storageLocation: CaStorageLocationUsageDTO;

  @Input() showTotalInfo: boolean = false;
}
