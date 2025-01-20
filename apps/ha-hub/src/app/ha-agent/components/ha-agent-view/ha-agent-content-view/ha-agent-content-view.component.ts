import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { HaAgentViewConfig } from '../ha-agent-content-view.class';

@Component({
    selector: 'ha-agent-content-view',
    templateUrl: './ha-agent-content-view.component.html',
    styleUrls: ['./ha-agent-content-view.component.scss'],
    standalone: false
})
export class HaAgentContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaAgentViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
