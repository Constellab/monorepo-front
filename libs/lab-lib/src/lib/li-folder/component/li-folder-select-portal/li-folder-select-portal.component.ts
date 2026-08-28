import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FL_PORTAL_DATA, FlOverlayRef, FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { LiFolder } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFolderSelectComponent } from '../li-folder-select/li-folder-select.component';

export interface LiFolderSelectPortalInput {
  folder?: LiFolder | null;
  helpText?: string;
}

export interface LiFolderSelectPortalResult {
  folder?: LiFolder;
}

@Component({
  selector: 'li-folder-select-portal',
  templateUrl: './li-folder-select-portal.component.html',
  styleUrls: ['./li-folder-select-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlPortalModule, LiFolderSelectComponent, ReactiveFormsModule, FormsModule, TranslatePipe],
})
export class LiFolderSelectPortalComponent {
  private overlayRef = inject(FlOverlayRef);

  folders: LiFolder | null | undefined;
  helpText: string | undefined;

  constructor() {
    const data = inject<LiFolderSelectPortalInput>(FL_PORTAL_DATA);

    this.folders = data.folder;
    this.helpText = data.helpText;
  }

  folderSelected(folder: LiFolder): void {
    const result: LiFolderSelectPortalResult = {
      folder: folder,
    };
    this.overlayRef.dispose(result);
  }
}
