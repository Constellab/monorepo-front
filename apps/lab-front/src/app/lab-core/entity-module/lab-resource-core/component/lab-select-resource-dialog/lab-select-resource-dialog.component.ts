import { Component, inject, OnInit } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { FlSavedSearch } from '@monorepo/front-core-lib/fl-search';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LabResourceSearchComponent } from '../lab-resource-search/lab-resource-search.component';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabSelectResourceDialogInput {
  savedSearches?: FlSavedSearch[];
}

/**
 * Dialog to search on resource and select one
 *
 * The dialog is closed when a resource is selected
 */
@Component({
  selector: 'lab-select-resource-dialog',
  templateUrl: './lab-select-resource-dialog.component.html',
  styleUrls: ['./lab-select-resource-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabResourceSearchComponent, TranslatePipe],
})
export class LabSelectResourceDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectResourceDialogComponent>>(MatDialogRef);

  savedSearch: FlSavedSearch[];

  constructor() {
    const data = inject<LabSelectResourceDialogInput>(MAT_DIALOG_DATA);

    this.savedSearch = data?.savedSearches;
  }

  ngOnInit(): void {}

  onResourceSelected(resource: LabResource): void {
    this.dialogRef.close(resource);
  }
}
