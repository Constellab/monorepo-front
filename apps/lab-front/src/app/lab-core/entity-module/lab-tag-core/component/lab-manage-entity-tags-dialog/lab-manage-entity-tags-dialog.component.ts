import { Component, inject } from '@angular/core';
import {
  FlAddTagEvent,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { LabEntityTagType, LabTag, LabTagDatasource } from '../../../../model/entities/lab-tag.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import {
  LabTagCheckPropagationComponent,
  LabTagCheckPropagationInput,
} from '../lab-tag-check-propagation/lab-tag-check-propagation.component';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { LabTagListComponent } from '../lab-tag-list/lab-tag-list.component';
import { MatDivider } from '@angular/material/divider';
import { FlTagModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-tag/fl-tag.module';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabManageEntityTagsDialogInput {
  entityType: LabEntityTagType;
  entityId: string;
  tags: LabTagDatasource;
}

/**
 * Dialog to manage the tags of an entity
 */
@Component({
  selector: 'lab-manage-entity-tags-dialog',
  templateUrl: './lab-manage-entity-tags-dialog.component.html',
  styleUrls: ['./lab-manage-entity-tags-dialog.component.scss'],
  imports: [
    FlDialogModule,
    FlTextIconModule,
    MatIcon,
    MatDialogContent,
    LabTagListComponent,
    MatDivider,
    FlTagModule,
    MatCheckbox,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    TranslatePipe,
  ],
})
export class LabManageEntityTagsDialogComponent {
  private input = inject<LabManageEntityTagsDialogInput>(MAT_DIALOG_DATA);
  private tagService = inject(LabTagService);
  private dialogService = inject(FlDialogService);
  private portalActionService = inject(FlPortalActionsService);
  private snackBarService = inject(FlSnackBarService);

  currentTags: LabTagDatasource;
  newTags: LabTagDatasource = new LabTagDatasource();

  isPropagable: boolean = false;

  isLoading: boolean = false;

  constructor() {
    const input = this.input;

    this.currentTags = input.tags;
  }

  addTag(tagEvent: FlAddTagEvent): void {
    const tag = LabTag.newUserTag(tagEvent.key, tagEvent.value);
    if (this.currentTags.findItem(tag)) {
      this.snackBarService.openErrorMessage({ text: 'tag_already_exists', translateText: true });
      return;
    }
    // init the propagable value with the first tag
    if (this.newTags.isEmpty()) {
      this.isPropagable = tagEvent.defaultIsPropagable;
    }

    if (this.newTags.findItem(tag)) return;
    this.newTags.addItem(tag);
  }

  removeNewTag(tag: LabTag): void {
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
    const data: LabTagCheckPropagationInput = {
      impactDTO$: this.tagService.checkPropagationAddTags(
        this.input.entityType,
        this.input.entityId,
        this.newTags.array
      ),
      mode: 'ADD',
    };
    this.dialogService
      .openMediumDialog(LabTagCheckPropagationComponent, { data: data })
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
          text: { text: 'adding_tag', translateText: true },
          action: this.tagService.addEntityTags(
            this.input.entityType,
            this.input.entityId,
            this.newTags.array,
            this.isPropagable
          ),
        },
        true
      )
      .subscribe((result: FlPortalActionResult<LabTag[]>) => {
        if (result.status === 'success') {
          this.currentTags.addItem(result.result);
        }
      });
    this.newTags.clear();
  }

  deleteExistingTag(tag: LabTag): void {
    const data: LabTagCheckPropagationInput = {
      impactDTO$: this.tagService.checkPropagationDeleteTags(this.input.entityType, this.input.entityId, tag),
      mode: 'REMOVE',
    };
    this.dialogService
      .openMediumDialog(LabTagCheckPropagationComponent, { data: data })
      .afterClosed()
      .subscribe({
        next: (result) => this.removeCheckPropagationDialogResult(tag, result),
      });
  }

  private removeCheckPropagationDialogResult(tag: LabTag, result?: FlConfirmDialogResult): void {
    if (result?.choice) {
      this.portalActionService
        .addAction(
          {
            type: 'delete-tag',
            text: { text: 'deleting_tag', translateText: true },
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
