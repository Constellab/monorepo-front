import { Component, OnInit } from '@angular/core';
import { CaProjectService } from '../../../../ca-core/service-api/ca-project.service';
import { CaProjectWithFolder } from '../../../../ca-core/model/entities/project/ca-project.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaFolderDatasource } from '../../../../ca-core/model/entities/project/ca-folder.class';
import {
  CaProjectFormDialogComponent,
  CaProjectFormDialogInput
} from '../../../../ca-core/entity-module/ca-project-core/component/ca-project-form-dialog/ca-project-form-dialog.component';

// TODO TO RENAME
@Component({
  selector: 'ca-my-projects-page',
  templateUrl: './ca-my-projects-page.component.html',
  styleUrls: ['./ca-my-projects-page.component.scss']
})
export class CaMyProjectsPageComponent implements OnInit {

  foldersDatasource: CaFolderDatasource;

  constructor(private projectService: CaProjectService,
              private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.foldersDatasource = this.projectService.getMyFoldersDatasource();
  }

  openCreateProjectDialog(): void {
    const dialogInput: CaProjectFormDialogInput = {
      mode: 'create'
    };
    this.dialogService.openSmallDialog(CaProjectFormDialogComponent, { data: dialogInput }).afterClosed().subscribe(
      projects => this.onCreateProjectClosed(projects)
    );
  }

  private onCreateProjectClosed(project?: CaProjectWithFolder): void {
    if (project) {
      // add the project at the beginning of the array
      // and refresh the array
      this.foldersDatasource.addItem(project.folderHierarchy, () => true);
    }
  }

}
