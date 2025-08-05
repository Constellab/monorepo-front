import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';

import { FlTag } from '../../fl-tag.class';
import { FlTagColorer } from '../../fl-tag-colorer.class';

/**
 * Simple component for tags
 */
@Component({
  selector: 'fl-tag',
  templateUrl: './fl-tag.component.html',
  styleUrls: ['./fl-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FlTagComponent {
  @Input({ required: true }) flTag: FlTag;

  @Input() tagColorer?: FlTagColorer;

  @Input() showDeleteIcon: boolean = false;

  @Output() deleteTag: EventEmitter<FlTag> = new EventEmitter();

  onDeleteTag(event: MouseEvent): void {
    // use to stop click event on tag
    ClHelpService.stopEventPropagation(event);

    this.deleteTag.next(this.flTag);
  }
}
