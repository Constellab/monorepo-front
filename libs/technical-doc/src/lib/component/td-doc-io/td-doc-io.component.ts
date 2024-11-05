import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TdIOSpec } from '../../model/td-process-type.class';

@Component({
  selector: 'td-doc-io',
  templateUrl: './td-doc-io.component.html',
  styleUrls: ['./td-doc-io.component.scss'],
})
export class TdDocIoComponent {
  @Input() ioSpec: TdIOSpec;

  @Input() showEditButton: boolean = false;

  @Output() updateSpec: EventEmitter<void> = new EventEmitter();
  @Output() deleteSpec: EventEmitter<void> = new EventEmitter();

  updateSpecClicked(): void {
    this.updateSpec.emit();
  }

  deleteSpecClicked(): void {
    this.deleteSpec.emit();
  }
}
