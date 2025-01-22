import { Component, Input, OnInit } from '@angular/core';
import { LabFolderObject } from '../../../../model/entities/lab-folder.class';
import { MatIcon } from '@angular/material/icon';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'lab-object-sync-info',
  templateUrl: './lab-object-sync-info.component.html',
  styleUrls: ['./lab-object-sync-info.component.scss'],
  imports: [MatIcon, FlUserModule, FlTextIconModule, TranslatePipe],
})
export class LabObjectSyncInfoComponent implements OnInit {
  @Input() object: LabFolderObject;

  constructor() {}

  ngOnInit(): void {}
}
