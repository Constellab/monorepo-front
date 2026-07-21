import { ChangeDetectionStrategy,Component, HostBinding } from '@angular/core';

import { TeElementInlineDirective } from '../../model/te-element.directive';
import { TeMentionUser } from '../../plugin/te-mention.class';

@Component({
  selector: 'te-mention-inline',
  templateUrl: './te-mention-inline.component.html',
  styleUrl: './te-mention-inline.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeMentionInlineComponent extends TeElementInlineDirective<TeMentionUser> {
  @HostBinding('attr.contenteditable') contenteditable = 'false';
}
