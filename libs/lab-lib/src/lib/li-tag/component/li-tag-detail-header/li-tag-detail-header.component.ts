import { Component, inject, input } from '@angular/core';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';

import { LiTagDetailState } from '../../state/li-tag-detail.state';

@Component({
  selector: 'li-tag-detail-header',
  imports: [FlSectionModule, FlFormModule],
  templateUrl: './li-tag-detail-header.component.html',
  styleUrl: './li-tag-detail-header.component.scss',
})
export class LiTagDetailHeaderComponent {
  private state = inject(LiTagDetailState);

  displayMode = input<'fullPage' | 'fullDialog' | 'dense'>('fullPage');

  tagKeyModel = this.state.tagKey;
}
