import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'fl-article-left-side',
  templateUrl: './fl-article-left-side.component.html',
  styleUrls: ['./fl-article-left-side.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlArticleLeftSideComponent {}
