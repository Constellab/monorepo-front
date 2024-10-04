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
  LabSelectNoteDialogComponent
} from '../../../lab-note-core/component/lab-note-note-dialog/lab-select-note-dialog.component';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { LabNoteService } from '../../../../entity-service/lab-note.service';
import { LabRouterService } from '../../../../service/lab-router.service';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { excludedViewInNote } from '../../../../model/entities/resource/lab-resource-view.entity';
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

  addToNoteIsLoading: boolean = false;

  excludedViewInNote = excludedViewInNote;

  constructor(private dialogService: FlDialogService,
              private noteService: LabNoteService,
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

  openSelectNote(): void {
    this.dialogService.openBigDialog(LabSelectNoteDialogComponent).afterClosed().subscribe(
      note => this.onSelectNoteClosed(note)
    );
  }

  private onSelectNoteClosed(note?: LabNote): void {
    if (!note) return;

    this.addToNoteIsLoading = true;
    this.noteService.addViewToContent(note.id, this.viewConfig.id).subscribe(
      {
        next: () => this.onSuccess(),
        error: () => this.addToNoteIsLoading = false
      });

  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.view_added_to_note', translateText: true });
    this.addToNoteIsLoading = false;
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
