import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TdIOSpec} from '../../model/td-process-type.class';

@Component({
  selector: 'td-doc-io',
  templateUrl: './td-doc-io.component.html',
  styleUrls: ['./td-doc-io.component.scss']
})
export class TdDocIoComponent {

  @Input() ioSpec: TdIOSpec;

  @Input() showEditButton: boolean = false;

  @Output() removeSpec: EventEmitter<void> = new EventEmitter();

  removeSpecClicked(): void {
    this.removeSpec.emit();
  }

}
