import {Component, Input} from '@angular/core';
import {TdIOSpec} from '@monorepo/technical-doc';

@Component({
  selector: 'ha-live-task-version-detail-io',
  templateUrl: './ha-live-task-version-detail-io.component.html',
  styleUrls: ['./ha-live-task-version-detail-io.component.scss']
})
export class HaLiveTaskVersionDetailIoComponent {

  @Input() ioSpec: TdIOSpec;

}
