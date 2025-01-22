import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  LabCreateTagResponse,
  LabTagKeyModel,
  LabTagValueModel,
  LabTagValueModelDatasource,
} from '../../../../model/entities/lab-tag.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlTag,
} from '@monorepo/front-core-lib';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { LabTagFormDialogComponent } from '../lab-tag-form-dialog/lab-tag-form-dialog.component';
import { ClHelpService } from '@monorepo/core-lib';
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
  MatExpansionPanelContent,
} from '@angular/material/expansion';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { FlInfiniteScrollModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlTagModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-tag/fl-tag.module';

/**
 * Component to show the LabTagEntity information
 * In this component you can select a tag value (with NgModel)
 * It also supports an add, update and delete tag value button
 */
@Component({
  selector: 'lab-tag-entity-detail',
  templateUrl: './lab-tag-entity-detail.component.html',
  styleUrls: ['./lab-tag-entity-detail.component.scss'],
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
export class LabTagEntityDetailComponent implements OnInit {
  private tagService = inject(LabTagService);
  private dialogService = inject(FlDialogService);

  @Input() tagEntity: LabTagKeyModel;

  @Output() lastTagValueDeleted: EventEmitter<void> = new EventEmitter();

  tagValues: LabTagValueModelDatasource;

  ngOnInit(): void {
    this.tagValues = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchValues(this.tagEntity.key, null, page, size),
      5
    );
  }

  openAddValueDialog(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const input: FlFormDialogInput<FlTag> = {
      mode: 'create',
      object: { key: this.tagEntity.key, value: null },
    };

    this.dialogService
      .openSmallDialog(LabTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.addClosed(createResponse));
  }

  private addClosed(createResponse?: LabCreateTagResponse): void {
    if (createResponse) {
      this.tagValues.addItem(createResponse.valueModel);
    }
  }

  openUpdateValueDialog(tag: LabTagValueModel): void {
    const input: FlFormDialogInput<FlTag> = {
      mode: 'update',
      object: tag,
    };

    this.dialogService
      .openSmallDialog(LabTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.updateClosed(createResponse));
  }

  private updateClosed(createResponse?: LabCreateTagResponse): void {
    if (createResponse) {
      this.tagValues.updateItem(createResponse.valueModel);
    }
  }

  openDeleteTag(tag: LabTagValueModel): void {
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

  private onDeleteClosed(result: FlConfirmDialogResult, tag: LabTagValueModel): void {
    if (!result.choice) return;
    this.tagValues.removeItem(tag);

    if (this.tagValues.isEmpty()) {
      this.lastTagValueDeleted.next();
    }
  }
}
