import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FlConfirmDialogResult, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlAddTagEvent, FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiEntityTagType,
  LiTag,
  LiTagDatasource,
  LiTagKeyModel,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import {
  LiTagCheckPropagationComponent,
  LiTagCheckPropagationInput,
} from '../li-tag-check-propagation/li-tag-check-propagation.component';
import { LiTagListComponent } from '../li-tag-list/li-tag-list.component';

export interface LiBulkManageEntityTagsDialogInput {
  entityType: LiEntityTagType;
  entityIds: string[];
}

/**
 * Dialog to add tags to several entities at once.
 */
@Component({
  selector: 'li-bulk-manage-entity-tags-dialog',
  templateUrl: './li-bulk-manage-entity-tags-dialog.component.html',
  styleUrls: ['./li-bulk-manage-entity-tags-dialog.component.scss'],
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    MatDialogContent,
    LiTagListComponent,
    FlTagModule,
    MatCheckbox,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    TranslatePipe,
    FlIconModule,
  ],
})
export class LiBulkManageEntityTagsDialogComponent {
  private input = inject<LiBulkManageEntityTagsDialogInput>(MAT_DIALOG_DATA);
  private tagService = inject(LiTagService);
  private dialogService = inject(FlDialogService);
  private portalActionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject<MatDialogRef<LiBulkManageEntityTagsDialogComponent>>(MatDialogRef);

  newTags: LiTagDatasource = new LiTagDatasource();

  isPropagable: boolean = false;

  addTag(tagEvent: FlAddTagEvent<LiTagKeyModel>): void {
    const tag = LiTag.newUserOriginTag(
      tagEvent.key.content,
      tagEvent.value.content,
      tagEvent.key.entity,
      tagEvent.value.entity
    );
    // init the propagable value with the first tag
    if (this.newTags.isEmpty()) {
      this.isPropagable = tagEvent.key.entity?.isPropagable ?? false;
    }

    if (this.newTags.findItem(tag)) {
      this.snackBarService.openErrorMessage({ text: 'li.tag_already_exists', translateText: true });
      return;
    }
    this.newTags.addItem(tag);
  }

  removeNewTag(tag: LiTag): void {
    this.newTags.removeItem(tag);
  }

  saveTags(): void {
    if (this.newTags.isEmpty()) return;

    if (this.isPropagable) {
      this.checkPropagation();
    } else {
      this.addTagsToEntities();
    }
  }

  private checkPropagation(): void {
    const data: LiTagCheckPropagationInput = {
      impactDTO$: this.tagService.checkPropagationAddTags(
        this.input.entityType,
        this.input.entityIds,
        this.newTags.array
      ),
      mode: 'ADD',
    };
    this.dialogService
      .openMediumDialog(LiTagCheckPropagationComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result: FlConfirmDialogResult) => {
          if (result?.choice) {
            this.addTagsToEntities();
          }
        },
      });
  }

  private addTagsToEntities(): void {
    this.portalActionService
      .addAction({
        type: 'add-tag',
        text: { text: 'li.adding_tag', translateText: true },
        action: this.tagService.addEntityTagsBulk(
          this.input.entityType,
          this.input.entityIds,
          this.newTags.array,
          this.isPropagable
        ),
        autoClose: true,
      })
      .subscribe((result: FlPortalActionResult<Record<string, LiTag[]>>) => {
        if (result.status === 'success') {
          this.dialogRef.close();
        }
      });
    this.newTags.clear();
  }
}
