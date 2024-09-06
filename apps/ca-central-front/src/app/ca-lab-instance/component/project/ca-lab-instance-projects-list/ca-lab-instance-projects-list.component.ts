import { Component, Input, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaLabProject,
  CaLabInstanceProjectDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-project.class';
import { CaLabInstanceDetailPageState } from '../../../state/ca-lab-instance-detail-page.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaLabProjectService } from '../../../../ca-core/service-api/ca-lab-project.service';
import { CaProject } from '../../../../ca-core/model/entities/project/ca-project.class';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput
} from '../../../../ca-core/entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaFolder } from '../../../../ca-core/model/entities/project/ca-folder.class';

@Component({
  selector: 'ca-lab-instance-projects-list',
  templateUrl: './ca-lab-instance-projects-list.component.html',
  styleUrls: ['./ca-lab-instance-projects-list.component.scss']
})
export class CaLabInstanceProjectsListComponent implements OnInit {

  @Input() labInstanceId: string;

  columns$: Observable<FlTableColumnStatic<CaLabProject>[]> = this.state.isLabOwner$().pipe(
    map(isLabOwner => {
      const columns = ['folder', 'createdBy', 'createdAt'];
      // set the action column only if the user is the lab owner
      if (isLabOwner) {
        columns.push('actions');
      }
      return columns;
    }));

  datasource: CaLabInstanceProjectDatasource;

  isOwner$: Observable<boolean> = this.state.isLabOwner$();

  constructor(private labProjectService: CaLabProjectService,
              private dialogService: FlDialogService,
              private state: CaLabInstanceDetailPageState,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.datasource = new CaLabInstanceProjectDatasource(
      this.labProjectService.getLabInstanceProjects(this.labInstanceId)
    );
  }

  openAddProjectDialog(): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'lab_add_project', translateText: true },
      mode: 'root'
    };
    this.dialogService.openMediumDialog(CaSelectFolderDialogComponent, { data: input, autoFocus: false })
      .afterClosed().subscribe((folder) => this.onFolderAddedClosed(folder));
  }

  private onFolderAddedClosed(folder?: CaFolder): void {
    if (folder) {
      this.actionService.addAction({
        type: 'lab-add-project',
        action: this.labProjectService.addProjectToLab(this.labInstanceId, folder.id),
        text: { text: 'adding_lab_project', translateText: true }
      }).subscribe(
        result => this.onActionFinished(result)
      );
    }
  }

  private onActionFinished(result: FlPortalActionResult<CaLabProject>): void {
    if (result.status === 'success') {
      this.datasource.addItem(result.result);
    }
  }
}
