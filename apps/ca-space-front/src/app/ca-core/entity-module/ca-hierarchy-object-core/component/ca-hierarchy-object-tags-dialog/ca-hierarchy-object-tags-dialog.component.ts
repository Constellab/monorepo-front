import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
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

import { CaAvailableTagDatasource } from '../../../../model/entities/ca-tag.class';
import { CaHierarchyObjectTagDatasource } from '../../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../../service-api/ca-hierarchy-object.service';
import { CaTagService } from '../../../../service-api/ca-tag.service';

export interface CaHierarchyObjectTagsDialogInput {
  hierarchyObjectId: string;
  tags?: FlTagDatasource;
  availableTags?: CaAvailableTagDatasource;
}

/**
 * Dialog to manage tags of a hierarchy object
 */
@Component({
  selector: 'ca-hierarchy-object-tags-dialog',
  imports: [
    FlDialogModule,
    FlTextIconModule,
    FlTagModule,
    MatDivider,
    FlTranslateModule,
    MatButtonModule,
    MatIconModule,
    FlIconModule,
  ],
  templateUrl: './ca-hierarchy-object-tags-dialog.component.html',
  styleUrl: './ca-hierarchy-object-tags-dialog.component.scss',
  providers: [{ provide: FlTagService, useClass: CaTagService }],
})
export class CaHierarchyObjectTagsDialogComponent implements OnInit {
  data: CaHierarchyObjectTagsDialogInput = inject(MAT_DIALOG_DATA);

  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private dialogService = inject(FlDialogService);
  private portalActionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);
  private tagService: CaTagService = inject(FlTagService) as CaTagService;

  tags: CaHierarchyObjectTagDatasource;

  newTags: CaHierarchyObjectTagDatasource = new FlTagDatasource();

  isLoading: boolean = false;

  ngOnInit(): void {
    if (this.data.tags) {
      this.tags = this.data.tags;
    } else {
      this.tags = new FlTagDatasource(this.hierarchyObjectService.getAllTags(this.data.hierarchyObjectId));
    }

    if (this.data.availableTags) {
      this.tagService.initFromTags(this.data.availableTags);
    } else {
      this.tagService.initFromObject(this.data.hierarchyObjectId);
    }
  }

  addTag(tagEvent: FlAddTagEvent): void {
    const tag: FlTag = { key: tagEvent.key.content, value: tagEvent.value.content };
    if (this.tags.findItem(tag)) {
      this.snackBarService.openErrorMessage({ text: 'tag_already_exists', translateText: true });
      return;
    }

    if (this.newTags.findItem(tag)) return;
    this.newTags.addItem(tag);
  }

  removeNewTag(tag: FlTag): void {
    this.newTags.removeItem(tag);
  }

  saveTags(): void {
    if (this.newTags.isEmpty()) return;

    this.addTagsToEntity();
  }

  private addTagsToEntity(): void {
    this.portalActionService
      .addAction({
        type: 'add-tag',
        text: { text: 'adding_tags', translateText: true },
        action: this.hierarchyObjectService.createTags(this.data.hierarchyObjectId, this.newTags.array),
        autoClose: true,
      })
      .subscribe((result: FlPortalActionResult<FlTag[]>) => {
        if (result.status === 'success') {
          this.tags.addItem(result.result);
          this.tagService.availableTags.addTag(result.result);
        }
      });
    this.newTags.clear();
  }

  deleteExistingTag(tag: FlTag): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_tag',
      content: 'delete_tag_confirmation',
      observable: this.hierarchyObjectService.deleteTag(this.data.hierarchyObjectId, tag),
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe({
        next: (result: FlConfirmDialogResult) => this.onDeleteClosed(result, tag),
      });
  }

  private onDeleteClosed(result: FlConfirmDialogResult, tag: FlTag): void {
    if (result.choice) {
      this.tags.removeItem(tag);
    }
  }
}
