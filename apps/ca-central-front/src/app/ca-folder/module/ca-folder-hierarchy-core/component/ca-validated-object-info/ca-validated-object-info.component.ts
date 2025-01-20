import { Component, Input, OnInit } from '@angular/core';
import { CaFolderObject } from '../../../../../ca-core/model/entities/folder/ca-folder.class';

/**
 * Simple component to show information about the validation of a folder object
 */
@Component({
    selector: 'ca-validated-object-info',
    templateUrl: './ca-validated-object-info.component.html',
    styleUrls: ['./ca-validated-object-info.component.scss'],
    standalone: false
})
export class CaValidatedObjectInfoComponent implements OnInit {
  @Input() object: CaFolderObject;

  constructor() {}

  ngOnInit(): void {}
}
