import {Component, Input} from '@angular/core';
import {CaStorageLocationUsageDTO} from '../../../../model/entities/project/ca-document.class';

@Component({
  selector: 'ca-project-storage-location-usage',
  templateUrl: './ca-project-storage-location-usage.component.html',
  styleUrl: './ca-project-storage-location-usage.component.scss'
})
export class CaProjectStorageLocationUsageComponent {

  @Input({required: true}) storageLocation: CaStorageLocationUsageDTO;

  @Input() showTotalInfo: boolean = false;
}
