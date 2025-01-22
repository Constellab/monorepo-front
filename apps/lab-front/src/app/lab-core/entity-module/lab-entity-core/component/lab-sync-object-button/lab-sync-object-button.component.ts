import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { LabFolderObject } from '../../../../model/entities/lab-folder.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';

/**
 * Component containing the button to sync a lab folder object with space
 */
@Component({
  selector: 'lab-sync-object-button',
  templateUrl: './lab-sync-object-button.component.html',
  styleUrls: ['./lab-sync-object-button.component.scss'],
  standalone: false,
})
export class LabSyncObjectButtonComponent<T extends LabFolderObject> implements OnInit {
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);

  @Input() object: T;

  @Input() syncObjectFunc: (id: string) => Observable<T>;

  @Input() additionalConfirmText: string;

  @Output() objectUpdate: EventEmitter<T> = new EventEmitter();

  isLoading: boolean = false;

  ngOnInit(): void {}

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
    let content = `<p>${this.translateService.translate('biox.sync_object_confirmation')}</p>`;

    if (this.additionalConfirmText) {
      content += `<p>${this.translateService.translate(this.additionalConfirmText)}</p>`;
    }

    const data: FlConfirmDialogInput = {
      title: 'biox.sync_with_space',
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
