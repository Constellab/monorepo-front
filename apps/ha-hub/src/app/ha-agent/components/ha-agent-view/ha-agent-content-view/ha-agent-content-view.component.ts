import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { HaAgentViewConfig } from '../ha-agent-content-view.class';
import { RvResourceViewModule } from '../../../../../../../../libs/resource-view/src/lib/rv-resource-view.module';

@Component({
  selector: 'ha-agent-content-view',
  templateUrl: './ha-agent-content-view.component.html',
  styleUrls: ['./ha-agent-content-view.component.scss'],
  imports: [RvResourceViewModule],
})
export class HaAgentContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaAgentViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
