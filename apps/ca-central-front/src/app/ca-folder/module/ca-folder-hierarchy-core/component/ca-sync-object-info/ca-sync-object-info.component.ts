import {Component, Input, OnInit} from '@angular/core';
import {CaFolderObject} from '../../../../../ca-core/model/entities/folder/ca-folder.class';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'ca-sync-object-info',
  templateUrl: './ca-sync-object-info.component.html',
  styleUrls: ['./ca-sync-object-info.component.scss']
})
export class CaSyncObjectInfoComponent implements OnInit {

  @Input() object: CaFolderObject;

  /**
   * If true show the icon and last synchronisation text
   */
  @Input() showText: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
  }

}
