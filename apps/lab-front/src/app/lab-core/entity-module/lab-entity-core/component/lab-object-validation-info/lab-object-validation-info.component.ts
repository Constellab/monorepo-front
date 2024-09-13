import {Component, Input, OnInit} from '@angular/core';
import {LabFolderObject} from '../../../../model/entities/lab-folder.class';

/**
 * Simple component to show information about the validation of a folder object
 */
@Component({
  selector: 'lab-object-validation-info',
  templateUrl: './lab-object-validation-info.component.html',
  styleUrls: ['./lab-object-validation-info.component.scss']
})
export class LabObjectValidationInfoComponent implements OnInit {

  @Input() object: LabFolderObject;

  constructor() {
  }

  ngOnInit(): void {
  }

}
