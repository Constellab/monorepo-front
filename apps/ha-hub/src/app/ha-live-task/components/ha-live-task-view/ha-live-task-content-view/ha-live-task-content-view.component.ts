import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {RvResourceView} from '@monorepo/resource-view';
import {TeElementBlockDirective} from '@monorepo/text-editor';
import {HaLiveTaskViewConfig} from '../ha-live-task-content-view.class';

@Component({
  selector: 'ha-live-task-content-view',
  templateUrl: './ha-live-task-content-view.component.html',
  styleUrls: ['./ha-live-task-content-view.component.scss']
})
export class HaLiveTaskContentViewComponent extends TeElementBlockDirective {

  @Input() viewConfig: HaLiveTaskViewConfig;

  @Input() view$: Observable<RvResourceView>;

}
