import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import {
  MatExpansionPanel,
  MatExpansionPanelContent,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlEntityPaginatedDatasource, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { FlTag, FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import {
  LiCreateTagResponse,
  LiTagKeyModel,
  LiTagService,
  LiTagValueModel,
  LiTagValueModelDatasource,
} from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiTagFormDialogComponent } from '../li-tag-form-dialog/li-tag-form-dialog.component';

/**
 * Component to show the LabTagEntity information
 * In this component you can select a tag value (with NgModel)
 * It also supports an add, update and delete tag value button
 */
@Component({
  selector: 'li-tag-entity-detail',
  templateUrl: './li-tag-entity-detail.component.html',
  styleUrls: ['./li-tag-entity-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatExpansionPanelContent,
    FlInfiniteScrollModule,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
    FlTagModule,
  ],
})
export class LiTagEntityDetailComponent implements OnInit {
  private tagService = inject(LiTagService);
  private dialogService = inject(FlDialogService);

  @Input() tagEntity: LiTagKeyModel;

  @Output() lastTagValueDeleted: EventEmitter<void> = new EventEmitter();

  tagValues: LiTagValueModelDatasource;

  ngOnInit(): void {
    this.tagValues = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchValues(this.tagEntity.key, '', page, size),
      5
    );
  }

  openAddValueDialog(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const input: FlFormDialogInput<FlTag> = {
      mode: 'create',
      object: { key: this.tagEntity.key, value: undefined },
    };

    this.dialogService
      .openSmallDialog(LiTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.addClosed(createResponse));
  }

  private addClosed(createResponse?: LiCreateTagResponse): void {
    if (createResponse) {
      this.tagValues.addItem(createResponse.valueModel);
    }
  }

  openUpdateValueDialog(tag: LiTagValueModel): void {
    const input: FlFormDialogInput<FlTag> = {
      mode: 'update',
      object: tag,
    };

    this.dialogService
      .openSmallDialog(LiTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.updateClosed(createResponse));
  }

  private updateClosed(createResponse?: LiCreateTagResponse): void {
    if (createResponse) {
      this.tagValues.updateItem(createResponse.valueModel);
    }
  }

  openDeleteTag(tag: LiTagValueModel): void {
    const data: FlConfirmDialogInput = {
      title: 'tag_delete',
      content: 'tag_delete_confirmation',
      observable: this.tagService.deleteTag(tag.key, tag.value),
      successMessage: 'tag_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, tag));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, tag: LiTagValueModel): void {
    if (!result.choice) return;
    this.tagValues.removeItem(tag);

    if (this.tagValues.isEmpty()) {
      this.lastTagValueDeleted.next();
    }
  }
}
