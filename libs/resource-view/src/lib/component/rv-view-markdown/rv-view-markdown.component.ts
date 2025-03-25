import { Component } from '@angular/core';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewMarkdown } from '../../model/rv-resource-view.class';

@Component({
  selector: 'rv-view-markdown',
  standalone: false,
  templateUrl: './rv-view-markdown.component.html',
  styleUrl: './rv-view-markdown.component.scss',
})
export class RvViewMarkdownComponent extends RvResourceViewDirective<RvResourceViewMarkdown> {}
