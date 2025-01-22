import { Component, OnInit, inject } from '@angular/core';
import {
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlFormDialogInput,
  FlTag,
} from '@monorepo/front-core-lib';
import { LabTagFormDialogComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-form-dialog/lab-tag-form-dialog.component';
import { LabTagHelpDialogComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-help-dialog/lab-tag-help-dialog.component';
import {
  LabCreateTagResponse,
  LabTagKeyModel,
  LabTagKeyModelDatasource,
} from '../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { LabTagEntityDetailComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-entity-detail/lab-tag-entity-detail.component';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-tags-page',
  templateUrl: './lab-monitoring-tags-page.component.html',
  styleUrls: ['./lab-monitoring-tags-page.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    FlInfiniteScrollModule,
    LabTagEntityDetailComponent,
    AsyncPipe,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabMonitoringTagsPageComponent implements OnInit {
  private tagService = inject(LabTagService);
  private dialogService = inject(FlDialogService);

  tagKeys: LabTagKeyModelDatasource;

  ngOnInit(): void {
    this.tagKeys = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchKeys(null, page, size),
      20
    );
  }

  openAddTagDialog(): void {
    const input: FlFormDialogInput<FlTag> = {
      mode: 'create',
    };

    this.dialogService
      .openSmallDialog(LabTagFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((createResponse) => this.onAddClosed(createResponse));
  }

  private onAddClosed(createResponse?: LabCreateTagResponse): void {
    if (createResponse) {
      this.tagKeys.addItem(createResponse.keyModel);
    }
  }

  openTagHelpDialog(): void {
    this.dialogService.openSmallDialog(LabTagHelpDialogComponent, { panelClass: 'g-dialog-main-background' });
  }

  lastTagValueDeleted(tagKey: LabTagKeyModel): void {
    this.tagKeys.removeItem(tagKey);
  }
}
