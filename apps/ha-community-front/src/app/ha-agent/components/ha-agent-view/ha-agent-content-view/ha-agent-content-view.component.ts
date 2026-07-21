import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { RvResourceView } from '@monorepo/resource-view';
import { RvResourceViewModule } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaAgentViewConfig } from '../ha-agent-content-view.class';

@Component({
  selector: 'ha-agent-content-view',
  templateUrl: './ha-agent-content-view.component.html',
  styleUrls: ['./ha-agent-content-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RvResourceViewModule],
})
export class HaAgentContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaAgentViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
