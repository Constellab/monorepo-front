import {Component, Input, OnInit} from '@angular/core';
import {TdIOSpec} from '@monorepo/technical-doc';
@Component({
  selector: 'ha-live-task-version-detail-io',
  templateUrl: './ha-live-task-version-detail-io.component.html',
  styleUrls: ['./ha-live-task-version-detail-io.component.scss']
})
export class HaLiveTaskVersionDetailIoComponent implements OnInit {

  @Input()
  ioSpec: TdIOSpec;

  constructor() { }

  ngOnInit(): void {
  }

}
