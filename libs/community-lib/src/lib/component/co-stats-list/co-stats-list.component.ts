import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'co-stats-list',
  templateUrl: './co-stats-list.component.html',
  styleUrls: ['./co-stats-list.component.scss'],
  imports: [NgClass, MatIcon, FlIconModule, MatTooltip, TranslatePipe],
})
export class CoStatsListComponent {
  likes = input<number>(0);
  comments = input<number>(undefined);
  executions = input<number>(undefined);
  dense = input<boolean>(false);
  isClickable = input<boolean>(false);
  isLiked = input<boolean>(false);

  likeClicked = output<void>();
  commentClicked = output<void>();

  onLikeClicked(): void {
    if (this.isClickable()) this.likeClicked.emit();
  }

  onCommentClicked(): void {
    if (this.isClickable()) this.commentClicked.emit();
  }
}
