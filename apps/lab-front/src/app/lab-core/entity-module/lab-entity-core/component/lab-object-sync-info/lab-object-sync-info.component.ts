import { Component, Input, OnInit } from '@angular/core';
import { LabFolderObject } from '../../../../model/entities/lab-folder.class';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'lab-object-sync-info',
  templateUrl: './lab-object-sync-info.component.html',
  styleUrls: ['./lab-object-sync-info.component.scss'],
})
export class LabObjectSyncInfoComponent implements OnInit {
  @Input() object: LabFolderObject;

  constructor() {}

  ngOnInit(): void {}
}
