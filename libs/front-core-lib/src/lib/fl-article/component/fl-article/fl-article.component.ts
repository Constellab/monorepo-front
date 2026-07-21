import { ChangeDetectionStrategy,Component } from '@angular/core';

@Component({
  selector: 'fl-article',
  templateUrl: './fl-article.component.html',
  styleUrls: ['./fl-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlArticleComponent {}
