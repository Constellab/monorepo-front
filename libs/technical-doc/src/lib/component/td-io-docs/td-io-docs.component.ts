import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TdIOSpec} from '../../model/td-process-type.class';

@Component({
  selector: 'td-io-docs',
  templateUrl: './td-io-docs.component.html',
  styleUrls: ['./td-io-docs.component.scss']
})
export class TdIoDocsComponent {

  @Input() ioSpecs: Record<string, TdIOSpec>;
  @Input() readOnly: boolean = true;

  @Output() deleteSpec: EventEmitter<string> = new EventEmitter();


  deleteSpecClicked(specId: string): void {
    this.deleteSpec.emit(specId);
  }
}
