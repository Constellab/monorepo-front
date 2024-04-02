import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {CaProjectStorageUsageDTO} from '../../../../model/entities/project/ca-document.class';

@Component({
  selector: 'ca-project-storage-usage',
  templateUrl: './ca-project-storage-usage.component.html',
  styleUrl: './ca-project-storage-usage.component.scss'
})
export class CaProjectStorageUsageComponent {

  @Input({required: true}) storageUsage$: Observable<CaProjectStorageUsageDTO>;
}
