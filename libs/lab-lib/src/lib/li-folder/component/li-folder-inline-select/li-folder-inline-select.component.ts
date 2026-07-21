import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, input, output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslatableText, FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiFolder, LiFolderService } from '@monorepo/lab-lib/li-core';

import { LiFolderInlineComponent } from '../li-folder-inline/li-folder-inline.component';
import {
  LiFolderSelectPortalComponent,
  LiFolderSelectPortalInput,
  LiFolderSelectPortalResult,
} from '../li-folder-select-portal/li-folder-select-portal.component';

/**
 * Component to show a folder inline with possibility to select another folder
 */
@Component({
  selector: 'li-folder-inline-select',
  templateUrl: './li-folder-inline-select.component.html',
  styleUrls: ['./li-folder-inline-select.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiFolderInlineSelectComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIcon, FlIconModule, LiFolderInlineComponent, MatButton, AsyncPipe, FlTranslateModule],
})
export class LiFolderInlineSelectComponent extends FlFormFieldDirective<LiFolder> {
  private portalService = inject(FlPortalService);
  private folderService = inject(LiFolderService);

  updateFolderHelpText = input<string>();

  placeholder = input<FlTranslatableText>('li.select_folder');

  selectionChange = output<LiFolder | null>();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  callChangeEvent(value: LiFolder): void {
    this.selectionChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LiFolder): void {
    if (obj == null) {
      this.value = null;
      return;
    }

    if (obj instanceof LiFolder) {
      this.value = obj;
    } else if (typeof obj === 'string') {
      this.folderService.getFolder(obj).subscribe((folder) => (this.value = folder));
    } else if ((obj as any).id != null) {
      this.folderService.getFolder((obj as any).id).subscribe((folder) => (this.value = folder));
    } else {
      this.value = null;
    }
  }

  openPortal(event: Event): void {
    if (this.disabled) return;

    const mouseEvent =
      event instanceof MouseEvent ? event : new MouseEvent('click', { clientX: 0, clientY: 0 });
    const config = this.portalService.configureRelativePortalFromMouseEvent(mouseEvent, ['bottom'], {
      disposeOnNavigation: true,
      disposeOnOutsideClick: true,
    });

    const data: LiFolderSelectPortalInput = {
      folder: this.value,
      helpText: this.updateFolderHelpText(),
    };

    this.portalService
      .createPortal(LiFolderSelectPortalComponent, config, data)
      .detachments()
      .subscribe((folder) => this.onPortalClosed(folder));
  }

  private onPortalClosed(result: LiFolderSelectPortalResult): void {
    if (result == null) return;

    const folder = result.folder;
    if (this.value?.id === folder?.id || (this.value == null && folder == null)) return;
    this.setAndEmitValue(folder);
  }
}
