import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaProject, CaProjectInfo, CaProjectWithFolder } from '../../../../model/entities/project/ca-project.class';
import {
  CaProjectFormDialogComponent,
  CaProjectFormDialogInput
} from '../ca-project-form-dialog/ca-project-form-dialog.component';
import {
  CaUpdateProjectLeaderDialogComponent,
  CaUpdateProjectLeaderDialogInput
} from '../ca-update-project-leader-dialog/ca-update-project-leader-dialog.component';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaProjectService } from '../../../../service-api/ca-project.service';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../model/entities/ca-user.class';
import { ClHelpService } from '@monorepo/core-lib';
import { CaRouterService } from '../../../../service/ca-router.service';

export type CaProjectActionEvent = {
  action: 'createChild';
  project: CaProjectWithFolder;
} | {
  action: 'update';
  project: CaProject;
} | {
  action: 'delete';
  project: CaProjectInfo;
}

/**
 * Action menu button to edit or a project
 */
@Component({
  selector: 'ca-project-actions-menu',
  templateUrl: './ca-project-actions-menu.component.html',
  styleUrls: ['./ca-project-actions-menu.component.scss']
})
export class CaProjectActionsMenuComponent {

  @Input({ required: true }) projectInfo: CaProjectInfo;

  /**
   * Optional, provide the list of users of the project to avoid a call to the server
   */
  @Input() projectUsers$?: Observable<CaUser[]>;

  @Input() stopClickEvent: boolean = false;

  @Output() projectAction: EventEmitter<CaProjectActionEvent> = new EventEmitter();

  constructor(private dialogService: FlDialogService,
              private projectService: CaProjectService) {
  }

  stopEvent(event: MouseEvent): void {
    if (this.stopClickEvent) {
      ClHelpService.stopEventPropagation(event);
    }
  }

  openUpdateProjectDialog(): void {
    const dialogInput: CaProjectFormDialogInput = {
      mode: 'update',
      projectId: this.projectInfo.id
    };

    this.dialogService.openSmallDialog(CaProjectFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      project => this.updateDialogClosed(project)
    );
  }

  private updateDialogClosed(project?: CaProjectWithFolder): void {
    if (project) {
      this.projectAction.emit({
        action: 'update',
        project: project
      });
    }
  }

  openChildCreation(): void {
    const dialogInput: CaProjectFormDialogInput = {
      mode: 'create',
      parentId: this.projectInfo.id
    };

    this.dialogService.openSmallDialog(CaProjectFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      project => this.createChildSuccess(project)
    );
  }

  private createChildSuccess(project: CaProjectWithFolder): void {
    if (project) {
      this.projectAction.emit({
        action: 'createChild',
        project: project
      });
    }
  }

  openUpdateProjectLeaderDialog(): void {
    const dialogInput: CaUpdateProjectLeaderDialogInput = {
      projectId: this.projectInfo.id,
      currentLeader: this.projectInfo.leader,
      users$: this.projectUsers$ ?? this.projectService.getUsersOfProject(this.projectInfo.id)
    };

    this.dialogService.openSmallDialog(CaUpdateProjectLeaderDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      leader => this.onLeaderClosed(leader)
    );
  }

  private onLeaderClosed(project: CaProject): void {
    if (project) {
      this.projectAction.emit({
        action: 'update',
        project: project
      });
    }
  }

  openDeleteProjectDialog(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_project',
      content: 'delete_project_confirm',
      translateTitleAndContent: true,
      observable: this.projectService.delete(this.projectInfo.id),
      successMessage: 'project_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.projectAction.emit({
        action: 'delete',
        project: this.projectInfo
      });
    }
  }

  get activityRoute(): string {
    return CaRouterService.getProjectActivityRoute(this.projectInfo.id);
  }

}
