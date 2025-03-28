import { ClHelpService } from '@monorepo/core-lib';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import {
  FlPrettyJsonDialogComponent,
  FlPrettyJsonDialogInput,
} from '@monorepo/front-core-lib/fl-json-editor';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiManageEntityTagsDialogComponent, LiManageEntityTagsDialogInput } from '@monorepo/lab-lib/li-tag';
import {
  LiNote,
  LiNoteService,
  LiResourceService,
  LiRouterService,
  LiTag,
  LiTagDatasource,
  LiTagService,
  LiViewConfig,
  excludedViewInNote,
} from '@monorepo/lab-lib/li-core';
import { LiSelectNoteDialogComponent } from '@monorepo/lab-lib/li-note';
import { LiUpdateViewConfigDialogComponent } from '../li-update-view-config-dialog/li-update-view-config-dialog.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Actions menu button for view configs, it has a ng-content for custom buttons
 */
@Component({
  selector: 'li-view-config-actions-menu',
  templateUrl: './li-view-config-actions-menu.component.html',
  styleUrls: ['./li-view-config-actions-menu.component.scss'],
  imports: [
    MatButton,
    MatMenuTrigger,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatMenu,
    MatMenuItem,
    FlIconModule,
    FlLoaderModule,
    RouterLink,
    TranslatePipe,
  ],
})
export class LiViewConfigActionsMenuComponent implements OnInit {
  private dialogService = inject(FlDialogService);
  private noteService = inject(LiNoteService);
  private snackBarService = inject(FlSnackBarService);
  private resourceService = inject(LiResourceService);
  private tagService = inject(LiTagService);

  @Input({ required: true }) viewConfig: LiViewConfig;

  @Input() mode: 'text' | 'icon' = 'text';

  tags: LiTagDatasource;

  @Output() update: EventEmitter<LiViewConfig> = new EventEmitter();
  @Output() updateTags: EventEmitter<LiTag[]> = new EventEmitter();

  addToNoteIsLoading: boolean = false;

  excludedViewInNote = excludedViewInNote;

  ngOnInit(): void {
    this.tags = this.tagService.getEntityTagsDatasource('VIEW', this.viewConfig.id);
  }

  get viewRoute(): { route: string; queryParams: any } {
    return LiRouterService.getViewConfigDetailRoute(this.viewConfig.resource.id, this.viewConfig.id);
  }

  stopPropagation(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  openUpdateName(): void {
    this.dialogService
      .openSmallDialog(LiUpdateViewConfigDialogComponent, { data: this.viewConfig })
      .afterClosed()
      .subscribe((updatedResource) => this.onUpdateResourceClosed(updatedResource));
  }

  private onUpdateResourceClosed(viewConfig?: LiViewConfig): void {
    if (viewConfig) {
      this.update.next(viewConfig);
    }
  }

  openTagFormDialog(): void {
    const data: LiManageEntityTagsDialogInput = {
      entityType: 'VIEW',
      entityId: this.viewConfig.id,
      tags: this.tags,
    };

    this.dialogService.openSmallDialog(LiManageEntityTagsDialogComponent, { data: data });
  }

  openSelectNote(): void {
    this.dialogService
      .openBigDialog(LiSelectNoteDialogComponent)
      .afterClosed()
      .subscribe((note) => this.onSelectNoteClosed(note));
  }

  private onSelectNoteClosed(note?: LiNote): void {
    if (!note) return;

    this.addToNoteIsLoading = true;
    this.noteService.addViewToContent(note.id, this.viewConfig.id).subscribe({
      next: () => this.onSuccess(),
      error: () => (this.addToNoteIsLoading = false),
    });
  }

  private onSuccess(): void {
    this.snackBarService.openSuccessMessage({ text: 'biox.view_added_to_note', translateText: true });
    this.addToNoteIsLoading = false;
  }

  showViewConfig(): void {
    const data: FlPrettyJsonDialogInput = {
      title: { text: this.viewConfig.title, translateText: false },
      object: {
        config_values: this.viewConfig.configValues,
        view_method_name: this.viewConfig.viewName,
      },
    };

    this.dialogService.openSmallDialog(FlPrettyJsonDialogComponent, { data });
  }

  downloadViewJsonFile(): void {
    this.resourceService
      .downloadResourceViewJsonFile(
        this.viewConfig.resource.id,
        this.viewConfig.viewName,
        this.viewConfig.configValues
      )
      .subscribe();
  }
}
