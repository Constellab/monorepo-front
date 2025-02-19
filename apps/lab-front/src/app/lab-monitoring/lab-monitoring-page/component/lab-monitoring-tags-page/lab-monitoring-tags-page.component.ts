import { Component, inject, OnInit } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlEntityPaginatedDatasource, FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlTag } from '@monorepo/front-core-lib/fl-tag';

import { LabTagFormDialogComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-form-dialog/lab-tag-form-dialog.component';
import { LabTagHelpDialogComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-help-dialog/lab-tag-help-dialog.component';
import {
  LabCreateTagResponse,
  LabTagKeyModel,
  LabTagKeyModelDatasource,
} from '../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../lab-core/entity-service/lab-tag.service';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { FlInfiniteScrollModule } from '@monorepo/front-core-lib/fl-infinite-scroll';
import { LabTagEntityDetailComponent } from '../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-entity-detail/lab-tag-entity-detail.component';
import { AsyncPipe } from '@angular/common';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

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
    FlIconModule,
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
