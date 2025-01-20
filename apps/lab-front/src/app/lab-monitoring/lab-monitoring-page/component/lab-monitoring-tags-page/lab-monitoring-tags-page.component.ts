import { Component, OnInit } from '@angular/core';
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

@Component({
    selector: 'lab-monitoring-tags-page',
    templateUrl: './lab-monitoring-tags-page.component.html',
    styleUrls: ['./lab-monitoring-tags-page.component.scss'],
    standalone: false
})
export class LabMonitoringTagsPageComponent implements OnInit {
  tagKeys: LabTagKeyModelDatasource;

  constructor(
    private tagService: LabTagService,
    private dialogService: FlDialogService
  ) {}

  ngOnInit(): void {
    this.tagKeys = new FlEntityPaginatedDatasource(
      (page, size) => this.tagService.searchKeys(null, page, size),
      20,
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
