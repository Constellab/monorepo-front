import { ChangeDetectionStrategy,Component } from '@angular/core';

import { RvResourceViewMarkdown } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

@Component({
  selector: 'rv-view-markdown',
  standalone: false,
  templateUrl: './rv-view-markdown.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './rv-view-markdown.component.scss',
})
export class RvViewMarkdownComponent extends RvResourceViewDirective<RvResourceViewMarkdown> {}
