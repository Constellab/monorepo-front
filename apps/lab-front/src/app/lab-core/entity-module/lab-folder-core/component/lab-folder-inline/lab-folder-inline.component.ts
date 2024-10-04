import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LabFolder} from '../../../../model/entities/lab-folder.class';

/**
 * Show folder information in a compact way
 */
@Component({
  selector: 'lab-folder-inline',
  templateUrl: './lab-folder-inline.component.html',
  styleUrls: ['./lab-folder-inline.component.scss']
})
export class LabFolderInlineComponent {

  @Input() folder: LabFolder;


  @Output() selectionChange: EventEmitter<LabFolder | null> = new EventEmitter();

}
