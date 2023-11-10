import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FlTag, FlTagDatasource, FlTagSelectedEvent} from '../../fl-tag.class';
import {FlTagColorer} from '../../fl-tag-colorer.class';

@Component({
  selector: 'fl-tag-list',
  templateUrl: './fl-tag-list.component.html',
  styleUrls: ['./fl-tag-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlTagListComponent {

  @Input() tags: FlTag[] | Record<string, string> | FlTagDatasource;

  @Input() tagSelectable: boolean = false;

  @Input() limitNumber: number = Infinity;

  @Input() showNoTagMessage: boolean = false;

  @Input() tagColorer?: FlTagColorer;

  @Output() tagSelected: EventEmitter<FlTagSelectedEvent> = new EventEmitter();


  selectTag(tag: FlTag, event: MouseEvent): void {
    this.tagSelected.next({
      tag: tag,
      event: event
    });
  }
}
