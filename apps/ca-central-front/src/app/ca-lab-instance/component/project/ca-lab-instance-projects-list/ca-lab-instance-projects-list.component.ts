import { Component, Input, OnInit } from '@angular/core';
import {
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  CaLabInstanceProject,
  CaLabInstanceProjectDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-instance-project.class';
import { CaLabInstanceDetailPageState } from '../../../state/ca-lab-instance-detail-page.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaLabProjectService } from '../../../../ca-core/service-api/ca-lab-project.service';
import {
  CaSelectProjectDialogComponent,
  CaSelectProjectDialogInput
} from '../../../../ca-core/entity-module/ca-project-core/component/ca-select-project-dialog/ca-select-project-dialog.component';
import { CaProject } from '../../../../ca-core/model/entities/project/ca-project.class';

@Component({
  selector: 'ca-lab-instance-projects-list',
  templateUrl: './ca-lab-instance-projects-list.component.html',
  styleUrls: ['./ca-lab-instance-projects-list.component.scss']
})
export class CaLabInstanceProjectsListComponent implements OnInit {

  @Input() labInstanceId: string;

  columns$: Observable<FlTableColumnStatic<CaLabInstanceProject>[]> = this.state.isLabOwner$().pipe(
    map(isLabOwner => {
      const columns = ['project', 'createdBy', 'createdAt'];
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
    const input: CaSelectProjectDialogInput = {
      title: { text: 'lab_add_project', translateText: true },
      mode: 'root'
    };
    this.dialogService.openMediumDialog(CaSelectProjectDialogComponent, { data: input, autoFocus: false })
      .afterClosed().subscribe((project) => this.onProjectAddedClosed(project));
  }

  private onProjectAddedClosed(project?: CaProject): void {
    if (project) {
      this.actionService.addAction({
        type: 'lab-add-project',
        action: this.labProjectService.addProjectToLab(this.labInstanceId, project.id),
        text: { text: 'adding_lab_project', translateText: true }
      }).subscribe(
        result => this.onActionFinished(result)
      );
    }
  }

  private onActionFinished(result: FlPortalActionResult<CaLabInstanceProject>): void {
    if (result.status === 'success') {
      this.datasource.addItem(result.result);
    }
  }
}
