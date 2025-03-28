import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { LiResource } from '@monorepo/lab-lib/li-core';
import { LiResourceSearchComponent } from '../li-resource-search/li-resource-search.component';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiSelectResourceDialogInput {
  savedSearches?: FlSavedSearch[];
}

/**
 * Dialog to search on resource and select one
 *
 * The dialog is closed when a resource is selected
 */
@Component({
  selector: 'li-select-resource-dialog',
  templateUrl: './li-select-resource-dialog.component.html',
  styleUrls: ['./li-select-resource-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiResourceSearchComponent, TranslatePipe],
})
export class LiSelectResourceDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectResourceDialogComponent>>(MatDialogRef);

  savedSearch: FlSavedSearch[];

  constructor() {
    const data = inject<LiSelectResourceDialogInput>(MAT_DIALOG_DATA);

    this.savedSearch = data?.savedSearches;
  }

  onResourceSelected(resource: LiResource): void {
    this.dialogRef.close(resource);
  }
}
