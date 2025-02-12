import { Component, Input } from '@angular/core';
import { CaFolderObject } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the sync of a folder object
 */
@Component({
  selector: 'ca-sync-object-info',
  templateUrl: './ca-sync-object-info.component.html',
  styleUrls: ['./ca-sync-object-info.component.scss'],
  imports: [FlUserModule, TranslatePipe],
})
export class CaSyncObjectInfoComponent {
  @Input() object: CaFolderObject;

  /**
   * If true show the icon and last synchronisation text
   */
  @Input() showText: boolean = true;
}
