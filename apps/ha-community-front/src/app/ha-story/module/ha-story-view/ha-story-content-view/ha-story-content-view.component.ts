import { ChangeDetectionStrategy,Component, Input } from '@angular/core';
import { RvResourceView } from '@monorepo/resource-view';
import { RvResourceViewModule } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaStoryViewConfig } from '../ha-story-content-view.block';

@Component({
  selector: 'ha-story-content-view',
  templateUrl: './ha-story-content-view.component.html',
  styleUrls: ['./ha-story-content-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RvResourceViewModule],
})
export class HaStoryContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaStoryViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
