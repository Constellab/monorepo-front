import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LabTag, LabTagDatasource } from '../../../../model/entities/lab-tag.entity';
import {
  FlDialogService,
  FlPrettyJsonDialogComponent,
  FlPrettyJsonDialogInput,
  FlSnackBarService
} from '@monorepo/front-core-lib';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import {
  LabUpdateViewConfigDialogComponent
} from '../lab-update-view-config-dialog/lab-update-view-config-dialog.component';
import { ClHelpService } from '@monorepo/core-lib';
import {
  LabSelectReportDialogComponent
} from '../../../lab-report-core/component/lab-select-report-dialog/lab-select-report-dialog.component';
import { LabReport } from '../../../../model/entities/lab-report.entity';
import { LabReportService } from '../../../../entity-service/lab-report.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { excludedViewInReport } from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabTagService } from '../../../../entity-service/lab-tag.service';

/**
 * Actions menu button for view configs, it has a ng-content for custom buttons
 */
@Component({
  selector: 'lab-view-config-actions-menu',
  templateUrl: './lab-view-config-actions-menu.component.html',
  styleUrls: ['./lab-view-config-actions-menu.component.scss']
})
export class LabViewConfigActionsMenuComponent implements OnInit {

  @Input({required: true}) viewConfig: LabViewConfig;

  @Input() mode: 'text' | 'icon' = 'text';

  tags: LabTagDatasource;

  @Output() update: EventEmitter<LabViewConfig> = new EventEmitter();
  @Output() updateTags: EventEmitter<LabTag[]> = new EventEmitter();

  addToReportIsLoading: boolean = false;

  excludedViewInReport = excludedViewInReport;

  constructor(private dialogService: FlDialogService,
              private reportService: LabReportService,
              private snackBarService: FlSnackBarService,
              private resourceService: LabResourceService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.tags = this.tagService.getEntityTagsDatasource('VIEW', this.viewConfig.id);
  }


  get viewRoute(): { route: string, queryParams: any } {
    return LabRouterService.getViewConfigDetailRoute(this.viewConfig.resource.id, this.viewConfig.id);
  }

  stopPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  openUpdateName(): void {
    this.dialogService.openSmallDialog(LabUpdateViewConfigDialogComponent,
      { data: this.viewConfig }).afterClosed().subscribe(
      updatedResource => this.onUpdateResourceClosed(updatedResource)
    );
  }

  private onUpdateResourceClosed(viewConfig?: LabViewConfig): void {
    if (viewConfig) {
      this.update.next(viewConfig);
    }
  }


  openTagFormDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'VIEW',
      entityId: this.viewConfig.id,
      tags: this.tags
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, { data: data });
  }

  openSelectReport(): void {
    this.dialogService.openBigDialog(LabSelectReportDialogComponent).afterClosed().subscribe(
      report => this.onSelectReportClosed(report)
    );
  }

  private onSelectReportClosed(report?: LabReport): void {
    if (!report) return;

    this.addToReportIsLoading = true;
    this.reportService.addViewToContent(report.id, this.viewConfig.id).subscribe(
      {
        next: () => this.onSuccess(),
        error: () => this.addToReportIsLoading = false
      });

  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.view_added_to_report', translateText: true });
    this.addToReportIsLoading = false;
  }

  showViewConfig(): void {
    const data: FlPrettyJsonDialogInput = {
      title: { text: this.viewConfig.title },
      object: {
        config_values: this.viewConfig.configValues,
        view_method_name: this.viewConfig.viewName
      }
    };

    this.dialogService.openSmallDialog(FlPrettyJsonDialogComponent, { data });
  }

  downloadViewJsonFile(): void {
    this.resourceService.downloadResourceViewJsonFile(this.viewConfig.resource.id, this.viewConfig.viewName, this.viewConfig.configValues).subscribe();
  }
}
