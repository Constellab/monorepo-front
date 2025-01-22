import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib';
import { LabFolder } from '../../../../model/entities/lab-folder.class';

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
  standalone: false,
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
