import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { LiFolderObject } from '@monorepo/lab-lib/li-core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component containing the button to sync a lab folder object with space
 */
@Component({
  selector: 'li-sync-object-button',
  templateUrl: './li-sync-object-button.component.html',
  styleUrls: ['./li-sync-object-button.component.scss'],
  imports: [MatTooltip, MatButton, MatIcon, FlLoaderModule, TranslatePipe],
})
export class LiSyncObjectButtonComponent<T extends LiFolderObject> {
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);

  @Input() object: T;

  @Input() syncObjectFunc: (id: string) => Observable<T>;

  @Input() additionalConfirmText: string;

  @Output() objectUpdate: EventEmitter<T> = new EventEmitter();

  isLoading: boolean = false;

  syncClick(): void {
    if (this.isLoading) return;
    // if this is the first sync, show the info dialog
    if (!this.object.isSynced) {
      this.openSyncConfirmDialog();
    } else {
      this.syncObject();
    }
  }

  private openSyncConfirmDialog(): void {
    let content = `<p>${this.translateService.translate('li.sync_object_confirmation')}</p>`;

    if (this.additionalConfirmText) {
      content += `<p>${this.translateService.translate(this.additionalConfirmText)}</p>`;
    }

    const data: FlConfirmDialogInput = {
      title: 'li.sync_with_space',
      content: { text: content, translateText: false },
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.syncObject();
        }
      });
  }

  private syncObject(): void {
    this.isLoading = true;

    this.syncObjectFunc(this.object.id).subscribe({
      next: (object: T) => this.onSyncSuccess(object),
      error: () => (this.isLoading = false),
    });
  }

  private onSyncSuccess(object: T): void {
    this.isLoading = false;
    this.objectUpdate.emit(object);
  }
}
