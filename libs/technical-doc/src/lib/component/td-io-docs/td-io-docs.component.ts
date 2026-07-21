import { ChangeDetectionStrategy,Component, EventEmitter, Input, Output } from '@angular/core';

import { TdIOSpec, TdIOSpecs } from '../../model/td-process-type.class';

export interface TdDocIOUpdateEvent {
  eventType: 'create' | 'update' | 'delete';
  spec?: TdIOSpec;
  specName?: string;
}

@Component({
  selector: 'td-io-docs',
  templateUrl: './td-io-docs.component.html',
  styleUrls: ['./td-io-docs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TdIoDocsComponent {
  @Input() ioSpecs: TdIOSpecs;
  @Input() readOnly: boolean = true;

  @Output() specEvent: EventEmitter<TdDocIOUpdateEvent> = new EventEmitter();

  addSpec(): void {
    this.specEvent.emit({
      eventType: 'create',
    });
  }

  updateSpec(specName: string, spec: TdIOSpec): void {
    this.specEvent.emit({
      eventType: 'update',
      spec: spec,
      specName: specName,
    });
  }

  deleteSpec(specName: string, spec: TdIOSpec): void {
    this.specEvent.emit({
      eventType: 'delete',
      specName: specName,
      spec: spec,
    });
  }
}
