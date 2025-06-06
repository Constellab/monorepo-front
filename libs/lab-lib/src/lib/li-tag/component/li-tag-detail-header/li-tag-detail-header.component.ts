import { Component, inject, input } from '@angular/core';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
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
