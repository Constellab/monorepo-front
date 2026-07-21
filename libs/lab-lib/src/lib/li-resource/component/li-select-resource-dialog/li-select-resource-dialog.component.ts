import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import {
  LiResource,
  LiResourceSearchFields,
  LiResourceSearchFieldsDisabled,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiResourceSearchComponent } from '../li-resource-search/li-resource-search.component';

export interface LiSelectResourceDialogInput {
  savedSearches?: FlSavedSearch[];

  defaultFilters?: LiResourceSearchFields;

  disabledFilters?: LiResourceSearchFieldsDisabled;
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlDialogModule, MatDialogContent, LiResourceSearchComponent, TranslatePipe],
})
export class LiSelectResourceDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectResourceDialogComponent>>(MatDialogRef);

  savedSearch: FlSavedSearch[];
  defaultFilters: LiResourceSearchFields;
  disabledFilters: LiResourceSearchFieldsDisabled;

  constructor() {
    const data = inject<LiSelectResourceDialogInput>(MAT_DIALOG_DATA);
    this.defaultFilters = data?.defaultFilters;
    this.disabledFilters = data?.disabledFilters;
    this.savedSearch = data?.savedSearches;
  }

  onResourceSelected(resource: LiResource): void {
    this.dialogRef.close(resource);
  }
}
