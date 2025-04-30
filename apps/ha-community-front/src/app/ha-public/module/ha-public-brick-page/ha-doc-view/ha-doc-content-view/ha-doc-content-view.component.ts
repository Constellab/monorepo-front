import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { HaDocViewConfig } from '../ha-doc-content-view.class';
import { RvResourceViewModule } from '@monorepo/resource-view';

@Component({
  selector: 'ha-doc-content-view',
  templateUrl: './ha-doc-content-view.component.html',
  styleUrls: ['./ha-doc-content-view.component.scss'],
  imports: [RvResourceViewModule],
})
export class HaDocContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaDocViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
