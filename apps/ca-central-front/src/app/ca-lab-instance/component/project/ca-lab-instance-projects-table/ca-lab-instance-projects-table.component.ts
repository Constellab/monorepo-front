import {Component, Input} from '@angular/core';
import {
  CaLabInstanceProject,
  CaLabInstanceProjectDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-instance-project.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
  FlTableAbstractDirective
} from '@monorepo/front-core-lib';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';

@Component({
  selector: 'ca-lab-instance-projects-table',
  templateUrl: './ca-lab-instance-projects-table.component.html',
  styleUrls: ['./ca-lab-instance-projects-table.component.scss']
})
export class CaLabInstanceProjectsTableComponent extends FlTableAbstractDirective<CaLabInstanceProject> {

  @Input() datasource: CaLabInstanceProjectDatasource;

  @Input() labInstanceId: string;

  constructor(private labInstanceService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private snackbarService: FlSnackBarService) {
    super(['project', 'createdBy', 'createdAt', 'actions']);
  }

  syncLabProject(labProject: CaLabInstanceProject): void {
    this.labInstanceService.syncLabProject(this.labInstanceId, labProject.project.id).subscribe(
      () => this.snackbarService.openSuccessMessage({text: 'lab_project_synced', translateText: true})
    );
  }

  openDeleteProjectDialog(labProject: CaLabInstanceProject): void {
    const data: FlConfirmDialogInput = {
      title: 'lab_remove_project',
      content: 'lab_remove_project_confirmation',
      translateTitleAndContent: true,
      observable: this.labInstanceService.removeProjectFromLab(this.labInstanceId, labProject.project.id),
      successMessage: 'lab_project_removed',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (result: FlConfirmDialogResult<void>) => this.onDeleteUserClosed(result, labProject)
    );
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult<void>, labProject: CaLabInstanceProject): void {
    if (result.choice) {
      this.datasource.removeItem(labProject);
    }
  }
}
