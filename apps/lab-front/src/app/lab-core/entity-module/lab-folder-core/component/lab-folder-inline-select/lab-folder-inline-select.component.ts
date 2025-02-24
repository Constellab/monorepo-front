import { Component, EventEmitter, inject, input, Input, Output } from '@angular/core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LabFolder } from '../../../../model/entities/lab-folder.class';
import { NgControl } from '@angular/forms';
import {
  LabFolderSelectPortalComponent,
  LabFolderSelectPortalInput,
  LabFolderSelectPortalResult,
} from '../lab-folder-select-portal/lab-folder-select-portal.component';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { LabFolderInlineComponent } from '../lab-folder-inline/lab-folder-inline.component';
import { MatButton } from '@angular/material/button';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { AsyncPipe } from '@angular/common';
import { LabFolderService } from '../../../../entity-service/lab-folder.service';

/**
 * Component to show a folder inline with possibility to select another folder
 */
@Component({
  selector: 'lab-folder-inline-select',
  templateUrl: './lab-folder-inline-select.component.html',
  styleUrls: ['./lab-folder-inline-select.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabFolderInlineSelectComponent }],
  imports: [
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    LabFolderInlineComponent,
    MatButton,
    AsyncPipe,
    FlTranslateModule,
  ],
})
export class LabFolderInlineSelectComponent extends FlFormFieldDirective<LabFolder> {
  private portalService = inject(FlPortalService);
  private folderService = inject(LabFolderService);

  @Input() updateFolderHelpText?: string;

  placeholder = input<FlTranslatableText>('biox.select_folder');

  @Output() selectionChange: EventEmitter<LabFolder | null> = new EventEmitter();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  callChangeEvent(value: LabFolder): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LabFolder): void {
    if (obj == null) {
      this.value = null;
      return;
    }

    if (obj instanceof LabFolder) {
      this.value = obj;
    } else if(typeof obj === 'string') {
      this.folderService.getFolder(obj).subscribe((folder) => (this.value = folder));
    } else if ((obj as any).id != null) {
      this.folderService.getFolder((obj as any).id).subscribe((folder) => (this.value = folder));
    } else {
      this.value = null;
    }
  }

  openPortal(event: MouseEvent): void {
    if (this.disabled) return;

    const config = this.portalService.configureRelativePortalFromMouseEvent(event, ['bottom'], {
      disposeOnNavigation: true,
      disposeOnOutsideClick: true,
    });

    const data: LabFolderSelectPortalInput = {
      folder: this.value,
      helpText: this.updateFolderHelpText,
    };

    this.portalService
      .createPortal(LabFolderSelectPortalComponent, config, data)
      .detachments()
      .subscribe((folder) => this.onPortalClosed(folder));
  }

  private onPortalClosed(result: LabFolderSelectPortalResult): void {
    if (result == null) return;

    const folder = result.folder;
    if (this.value?.id === folder?.id || (this.value == null && folder == null)) return;
    this.setAndEmitValue(folder);
  }
}
