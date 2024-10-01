import { Component, Input, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import { CaLabFolder, CaLabFolderDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-folder.class';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaLabFolderService } from '../../../../ca-core/service-api/ca-lab-folder.service';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput
} from '../../../../ca-core/entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaHierarchyObject } from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

@Component({
  selector: 'ca-lab-folders-list',
  templateUrl: './ca-lab-folders-list.component.html',
  styleUrls: ['./ca-lab-folders-list.component.scss']
})
export class CaLabFoldersListComponent implements OnInit {

  @Input() labId: string;

  columns$: Observable<FlTableColumnStatic<CaLabFolder>[]> = this.state.isLabOwner$().pipe(
    map(isLabOwner => {
      const columns = ['folder', 'createdBy', 'createdAt'];
      // set the action column only if the user is the lab owner
      if (isLabOwner) {
        columns.push('actions');
      }
      return columns;
    }));

  datasource: CaLabFolderDatasource;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  constructor(private labFolderService: CaLabFolderService,
              private dialogService: FlDialogService,
              private state: CaLabDetailPageState,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.datasource = new CaLabFolderDatasource(
      this.labFolderService.getLabFolders(this.labId)
    );
  }

  openAddFolderDialog(): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'lab_add_folder', translateText: true },
      mode: 'root'
    };
    this.dialogService.openMediumDialog(CaSelectFolderDialogComponent, { data: input, autoFocus: false })
      .afterClosed().subscribe((folder) => this.onFolderAddedClosed(folder));
  }

  private onFolderAddedClosed(folder?: CaHierarchyObject): void {
    if (folder) {
      this.actionService.addAction({
        type: 'lab-add-folder',
        action: this.labFolderService.addFolderToLab(this.labId, folder.id),
        text: { text: 'adding_lab_folder', translateText: true }
      }).subscribe(
        result => this.onActionFinished(result)
      );
    }
  }

  private onActionFinished(result: FlPortalActionResult<CaLabFolder>): void {
    if (result.status === 'success') {
      this.datasource.addItem(result.result);
    }
  }
}
