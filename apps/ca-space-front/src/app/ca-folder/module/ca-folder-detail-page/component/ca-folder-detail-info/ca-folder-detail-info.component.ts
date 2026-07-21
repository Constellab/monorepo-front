import { ChangeDetectionStrategy,Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';

import { CaFolderActionService } from '../../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import {
  CaFolder,
  CaFolderWithHierarchy,
} from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';

@Component({
  selector: 'ca-folder-detail-info',
  templateUrl: './ca-folder-detail-info.component.html',
  styleUrl: './ca-folder-detail-info.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlUserModule,
    FlDateModule,
    TranslatePipe,
  ],
})
export class CaFolderDetailInfoComponent {
  folder = input.required<CaFolder>();
  canEditFolder = input.required<boolean>();

  private folderActionService = inject(CaFolderActionService);
  private eventState = inject(CaHierarchyObjectEventState);

  openUpdateFolderDialog(): void {
    this.folderActionService
      .openUpdateFolderDialog(this.folder().id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.eventState.emitFolderUpdate(folder);
    }
  }
}
