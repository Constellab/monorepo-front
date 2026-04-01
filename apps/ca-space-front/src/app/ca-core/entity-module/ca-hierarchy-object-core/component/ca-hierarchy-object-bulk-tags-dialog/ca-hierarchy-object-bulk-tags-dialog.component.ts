import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClBulkActionResult } from '@monorepo/core-lib';
import { FlBulkActionContext } from '@monorepo/front-core-lib/fl-bulk-selection';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import {
  FlAddTagEvent,
  FlTag,
  FlTagDatasource,
  FlTagModule,
  FlTagService,
} from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { CaHierarchyObjectTagDatasource } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../../service-api/ca-hierarchy-object.service';
import { CaTagService } from '../../../../service-api/ca-tag.service';

export interface CaHierarchyObjectBulkTagsDialogInput {
  parentHierarchyObjectId: string;
  context: FlBulkActionContext;
}

@Component({
  selector: 'ca-hierarchy-object-bulk-tags-dialog',
  imports: [
    FlDialogModule,
    FlTextIconModule,
    FlTagModule,
    FlTranslateModule,
    MatButtonModule,
    MatIconModule,
    FlIconModule,
  ],
  templateUrl: './ca-hierarchy-object-bulk-tags-dialog.component.html',
  styleUrl: './ca-hierarchy-object-bulk-tags-dialog.component.scss',
  providers: [{ provide: FlTagService, useClass: CaTagService }],
})
export class CaHierarchyObjectBulkTagsDialogComponent implements OnInit {
  data: CaHierarchyObjectBulkTagsDialogInput = inject(MAT_DIALOG_DATA);

  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private portalActionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);
  private tagService: CaTagService = inject(FlTagService) as CaTagService;
  private dialogRef = inject(MatDialogRef<CaHierarchyObjectBulkTagsDialogComponent>);

  newTags: CaHierarchyObjectTagDatasource = new FlTagDatasource();

  ngOnInit(): void {
    this.tagService.initFromChildren(this.data.parentHierarchyObjectId);
  }

  addTag(tagEvent: FlAddTagEvent): void {
    const tag: FlTag = { key: tagEvent.key.content, value: tagEvent.value.content };

    if (this.newTags.findItem(tag)) {
      this.snackBarService.openErrorMessage({ text: 'tag_already_exists', translateText: true });
      return;
    }
    this.newTags.addItem(tag);
  }

  removeNewTag(tag: FlTag): void {
    this.newTags.removeItem(tag);
  }

  saveTags(): void {
    if (this.newTags.isEmpty()) return;

    this.portalActionService
      .addAction({
        type: 'add-tag',
        text: { text: 'adding_tags', translateText: true },
        action: this.hierarchyObjectService.bulkCreateTags(this.data.context, this.newTags.array),
        autoClose: true,
      })
      .subscribe((result: FlPortalActionResult<ClBulkActionResult>) => {
        if (result.status === 'success') {
          this.tagService.availableTags.addTag(this.newTags.array);
          this.dialogRef.close();
        }
      });
    this.newTags.clear();
  }
}
