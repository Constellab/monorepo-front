import { Component, Input, OnInit } from '@angular/core';
import { CaFolderObject } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { MatIcon } from '@angular/material/icon';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'ca-sync-object-info',
  templateUrl: './ca-sync-object-info.component.html',
  styleUrls: ['./ca-sync-object-info.component.scss'],
  imports: [MatIcon, FlUserModule, TranslatePipe],
})
export class CaSyncObjectInfoComponent implements OnInit {
  @Input() object: CaFolderObject;

  /**
   * If true show the icon and last synchronisation text
   */
  @Input() showText: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
