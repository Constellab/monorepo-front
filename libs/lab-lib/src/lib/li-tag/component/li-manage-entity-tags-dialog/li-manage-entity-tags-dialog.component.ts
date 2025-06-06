import { Component, inject } from '@angular/core';
import { FlAddTagEvent, FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlConfirmDialogResult, FlDialogModule, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  LiEntityTagType,
  LiTag,
  LiTagDatasource,
  LiTagKeyModel,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import {
  LiTagCheckPropagationComponent,
  LiTagCheckPropagationInput,
} from '../li-tag-check-propagation/li-tag-check-propagation.component';
import { LiTagListComponent } from '../li-tag-list/li-tag-list.component';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface LiManageEntityTagsDialogInput {
  entityType: LiEntityTagType;
  entityId: string;
  tags: LiTagDatasource;
}

/**
 * Dialog to manage the tags of an entity
 */
@Component({
  selector: 'li-manage-entity-tags-dialog',
  templateUrl: './li-manage-entity-tags-dialog.component.html',
  styleUrls: ['./li-manage-entity-tags-dialog.component.scss'],
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    MatDialogContent,
    LiTagListComponent,
    MatDivider,
    FlTagModule,
    MatCheckbox,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    TranslatePipe,
    FlIconModule,
  ],
})
export class LiManageEntityTagsDialogComponent {
  private input = inject<LiManageEntityTagsDialogInput>(MAT_DIALOG_DATA);
  private tagService = inject(LiTagService);
  private dialogService = inject(FlDialogService);
  private portalActionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);

  currentTags: LiTagDatasource;
  newTags: LiTagDatasource = new LiTagDatasource();

  isPropagable: boolean = false;

  isLoading: boolean = false;

  constructor() {
    const input = this.input;

    this.currentTags = input.tags;
  }

  addTag(tagEvent: FlAddTagEvent<LiTagKeyModel>): void {
    const tag = tagEvent.key.entity.isCommunityTag ?
      LiTag.newCommunityTag(tagEvent.key.content, tagEvent.value.content) :
      LiTag.newUserTag(tagEvent.key.content, tagEvent.value.content);
    if (this.currentTags.findItem(tag)) {
      this.snackBarService.openErrorMessage({ text: 'li.tag_already_exists', translateText: true });
      return;
    }
    // init the propagable value with the first tag
    if (this.newTags.isEmpty()) {
      this.isPropagable = tagEvent.key.entity?.isPropagable ?? false;
    }

    if (this.newTags.findItem(tag)) return;
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
      this.addTagsToEntity();
    }
  }

  private checkPropagation(): void {
    const data: LiTagCheckPropagationInput = {
      impactDTO$: this.tagService.checkPropagationAddTags(
        this.input.entityType,
        this.input.entityId,
        this.newTags.array
      ),
      mode: 'ADD',
    };
    this.dialogService
      .openMediumDialog(LiTagCheckPropagationComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result) => this.addCheckPropagationDialogResult(result),
      });
  }

  private addCheckPropagationDialogResult(result?: FlConfirmDialogResult): void {
    if (result?.choice) {
      this.addTagsToEntity();
    }
  }

  private addTagsToEntity(): void {
    this.portalActionService
      .addAction(
        {
          type: 'add-tag',
          text: { text: 'li.adding_tag', translateText: true },
          action: this.tagService.addEntityTags(
            this.input.entityType,
            this.input.entityId,
            this.newTags.array,
            this.isPropagable
          ),
        },
        true
      )
      .subscribe((result: FlPortalActionResult<LiTag[]>) => {
        if (result.status === 'success') {
          this.currentTags.addItem(result.result);
        }
      });
    this.newTags.clear();
  }

  deleteExistingTag(tag: LiTag): void {
    const data: LiTagCheckPropagationInput = {
      impactDTO$: this.tagService.checkPropagationDeleteTags(this.input.entityType, this.input.entityId, tag),
      mode: 'REMOVE',
    };
    this.dialogService
      .openMediumDialog(LiTagCheckPropagationComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result) => this.removeCheckPropagationDialogResult(tag, result),
      });
  }

  private removeCheckPropagationDialogResult(tag: LiTag, result?: FlConfirmDialogResult): void {
    if (result?.choice) {
      this.portalActionService
        .addAction(
          {
            type: 'delete-tag',
            text: { text: 'li.deleting_tag', translateText: true },
            action: this.tagService.deleteEntityTag(this.input.entityType, this.input.entityId, tag),
          },
          true
        )
        .subscribe((result: FlPortalActionResult<void>) => {
          if (result.status === 'success') {
            this.currentTags.removeItem(tag);
          }
        });
    }
  }
}
