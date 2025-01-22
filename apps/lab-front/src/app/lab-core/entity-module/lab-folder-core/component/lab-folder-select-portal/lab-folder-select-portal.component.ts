import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib';
import { LabFolder } from '../../../../model/entities/lab-folder.class';
import { FlPortalModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-portal/fl-portal.module';
import { LabFolderSelectComponent } from '../lab-folder-select/lab-folder-select.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabFolderSelectPortalInput {
  folder?: LabFolder;
  helpText?: string;
}

export interface LabFolderSelectPortalResult {
  folder?: LabFolder;
}

@Component({
  selector: 'lab-folder-select-portal',
  templateUrl: './lab-folder-select-portal.component.html',
  styleUrls: ['./lab-folder-select-portal.component.scss'],
  imports: [FlPortalModule, LabFolderSelectComponent, ReactiveFormsModule, FormsModule, TranslatePipe],
})
export class LabFolderSelectPortalComponent {
  private overlayRef = inject(FlOverlayRef);

  folders: LabFolder;
  helpText: string;

  constructor() {
    const data = inject<LabFolderSelectPortalInput>(FL_PORTAL_DATA);

    this.folders = data.folder;
    this.helpText = data.helpText;
  }

  folderSelected(folder: LabFolder): void {
    const result: LabFolderSelectPortalResult = {
      folder: folder,
    };
    this.overlayRef.dispose(result);
  }
}
