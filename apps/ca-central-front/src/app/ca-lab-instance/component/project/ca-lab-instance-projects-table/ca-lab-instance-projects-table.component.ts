import { Component, Input } from '@angular/core';
import {
  CaLabProject,
  CaLabInstanceProjectDatasource
} from '../../../../ca-core/model/entities/lab/ca-lab-project.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import { CaLabProjectService } from '../../../../ca-core/service-api/ca-lab-project.service';

@Component({
  selector: 'ca-lab-instance-projects-table',
  templateUrl: './ca-lab-instance-projects-table.component.html',
  styleUrls: ['./ca-lab-instance-projects-table.component.scss']
})
export class CaLabInstanceProjectsTableComponent {

  @Input({ required: true }) datasource: CaLabInstanceProjectDatasource;

  @Input({ required: true }) labInstanceId: string;

  @Input() columns: FlTableColumnStatic<CaLabProject>[] = ['folder', 'createdBy', 'createdAt'];

  constructor(private labProjectService: CaLabProjectService,
              private dialogService: FlDialogService,
              private snackbarService: FlSnackBarService) {
  }

  syncLabProject(labProject: CaLabProject): void {
    this.labProjectService.syncLabProject(this.labInstanceId, labProject.rootFolder.id).subscribe(
      () => this.snackbarService.openSuccessMessage({ text: 'lab_project_synced', translateText: true })
    );
  }

  openDeleteProjectDialog(labProject: CaLabProject): void {
    const data: FlConfirmDialogInput = {
      title: 'lab_remove_project',
      content: 'lab_remove_project_confirmation',
      translateTitleAndContent: true,
      observable: this.labProjectService.removeProjectFromLab(this.labInstanceId, labProject.rootFolder.id),
      successMessage: 'lab_project_removed',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(data).afterClosed().subscribe(
      (result: FlConfirmDialogResult<void>) => this.onDeleteUserClosed(result, labProject)
    );
  }

  private onDeleteUserClosed(result: FlConfirmDialogResult<void>, labProject: CaLabProject): void {
    if (result.choice) {
      this.datasource.removeItem(labProject);
    }
  }
}
