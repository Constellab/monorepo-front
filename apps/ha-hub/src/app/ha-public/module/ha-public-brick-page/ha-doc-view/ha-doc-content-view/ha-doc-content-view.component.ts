import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {RvResourceView} from '@monorepo/resource-view';
import {TeElementBlockDirective} from '@monorepo/text-editor';
import {HaDocViewConfig} from '../ha-doc-content-view.class';

@Component({
  selector: 'ha-doc-content-view',
  templateUrl: './ha-doc-content-view.component.html',
  styleUrls: ['./ha-doc-content-view.component.scss']
})
export class HaDocContentViewComponent extends TeElementBlockDirective {

  @Input() viewConfig: HaDocViewConfig;

  @Input() view$: Observable<RvResourceView>;

}
