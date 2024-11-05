import { Component, HostBinding } from '@angular/core';
import { TeElementInlineDirective } from '../../model/te-element.directive';
import { FlMentionUser } from '../../plugin/te-mention.class';

@Component({
  selector: 'te-mention-inline',
  templateUrl: './te-mention-inline.component.html',
  styleUrl: './te-mention-inline.component.scss',
})
export class TeMentionInlineComponent extends TeElementInlineDirective<FlMentionUser> {
  @HostBinding('attr.contenteditable') contenteditable = 'false';
}
