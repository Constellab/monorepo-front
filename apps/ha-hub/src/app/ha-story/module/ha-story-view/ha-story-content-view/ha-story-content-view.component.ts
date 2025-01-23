import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { RvResourceView } from '@monorepo/resource-view';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { HaStoryViewConfig } from '../ha-story-content-view.block';
import { RvResourceViewModule } from '../../../../../../../../libs/resource-view/src/lib/rv-resource-view.module';

@Component({
  selector: 'ha-story-content-view',
  templateUrl: './ha-story-content-view.component.html',
  styleUrls: ['./ha-story-content-view.component.scss'],
  imports: [RvResourceViewModule],
})
export class HaStoryContentViewComponent extends TeElementBlockDirective {
  @Input() viewConfig: HaStoryViewConfig;

  @Input() view$: Observable<RvResourceView>;
}
