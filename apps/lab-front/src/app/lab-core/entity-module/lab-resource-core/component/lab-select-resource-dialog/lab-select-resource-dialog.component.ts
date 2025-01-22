import { Component, OnInit, inject } from '@angular/core';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { FlSavedSearch } from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
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
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, LabResourceSearchComponent, TranslatePipe],
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
