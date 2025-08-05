import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput,
} from '../../../../ca-core/entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaHierarchyObject } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaLabFolder,
  CaLabFolderDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-folder.class';
import { CaLabFolderService } from '../../../../ca-core/service-api/ca-lab-folder.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabFoldersTableComponent } from '../ca-lab-folders-table/ca-lab-folders-table.component';

@Component({
  selector: 'ca-lab-folders-list',
  templateUrl: './ca-lab-folders-list.component.html',
  styleUrls: ['./ca-lab-folders-list.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatTooltip,
    FlSectionModule,
    CaLabFoldersTableComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabFoldersListComponent implements OnInit {
  private labFolderService = inject(CaLabFolderService);
  private dialogService = inject(FlDialogService);
  private state = inject(CaLabDetailPageState);
  private actionService = inject(FlPortalActionsService);

  @Input() labId: string;

  columns$: Observable<FlTableColumnStatic<CaLabFolder>[]> = this.state.isLabOwner$().pipe(
    map((isLabOwner) => {
      const columns = ['folder', 'createdBy', 'createdAt'];
      // set the action column only if the user is the lab owner
      if (isLabOwner) {
        columns.push('actions');
      }
      return columns;
    })
  );

  datasource: CaLabFolderDatasource;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  ngOnInit(): void {
    this.datasource = new CaLabFolderDatasource(this.labFolderService.getLabFolders(this.labId));
  }

  openAddFolderDialog(): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'lab_add_folder', translateText: true },
      mode: 'root',
    };
    this.dialogService
      .openMediumDialog(CaSelectFolderDialogComponent, { data: input, autoFocus: false })
      .afterClosed()
      .subscribe((folder) => this.onFolderAddedClosed(folder));
  }

  private onFolderAddedClosed(folder?: CaHierarchyObject): void {
    if (folder) {
      this.actionService
        .addAction({
          type: 'lab-add-folder',
          action: this.labFolderService.addFolderToLab(this.labId, folder.id),
          text: { text: 'adding_lab_folder', translateText: true },
        })
        .subscribe((result) => this.onActionFinished(result));
    }
  }

  private onActionFinished(result: FlPortalActionResult<CaLabFolder>): void {
    if (result.status === 'success') {
      this.datasource.addItem(result.result);
    }
  }
}
