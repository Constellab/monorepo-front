import { Component, ViewContainerRef } from '@angular/core';
import { CaProject } from '../../../../../ca-core/model/entities/project/ca-project.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaProjectDetailState } from '../../state/ca-project-detail.state';
import { Observable } from 'rxjs';
import { CaUser } from '../../../../../ca-core/model/entities/ca-user.class';
import {
  CaProjectSharedGroupsListInput,
  CaProjectSharedListComponent
} from '../ca-project-shared-list/ca-project-shared-list.component';
import {
  CaProjectUserConfigDialogComponent,
  CaProjectUserConfigDialogInput
} from '../ca-project-user-config-dialog/ca-project-user-config-dialog.component';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import {
  CaProjectActionEvent
} from '../../../../../ca-core/entity-module/ca-project-core/component/ca-project-actions-menu/ca-project-actions-menu.component';

/**
 * Show detailed information for a project , used in ProjectDetailPage
 */
@Component({
  selector: 'ca-project-detail',
  templateUrl: './ca-project-detail.component.html',
  styleUrls: ['./ca-project-detail.component.scss']
})
export class CaProjectDetailComponent {

  projectId$: Observable<string> = this.state.getFolderId$();
  project$: Observable<CaProject> = this.state.getProject$();
  projectUsers$: Observable<CaUser[]> = this.state.getUsers().connect();

  isRootProject$: Observable<boolean> = this.state.isRootProject$();
  canEditProject$: Observable<boolean> = this.state.canEditProject$();

  constructor(private dialogService: FlDialogService,
              private state: CaProjectDetailState,
              private rightPanelState: CaFolderRightPanelState,
              private viewContainerRef: ViewContainerRef) {
  }

  onProjectAction(projectEvent: CaProjectActionEvent): void {
    if (projectEvent.action === 'update') {
      this.state.updateProject(projectEvent.project);
    } else if (projectEvent.action === 'delete') {
      this.state.deleteFolder(projectEvent.project.id);
    } else if (projectEvent.action === 'createChild') {
      this.state.addFolderChild(projectEvent.project.folderHierarchy);
    }
  }

  openShareDialog(project: CaProject): void {
    const input: CaProjectSharedGroupsListInput = {
      projectId: project.id,
      canEdit$: this.state.canEditProject$()
    };

    this.dialogService.openSmallDialog(CaProjectSharedListComponent,
      { data: input, viewContainerRef: this.viewContainerRef, autoFocus: false });
  }

  openUserConfigDialog(project: CaProject): void {
    const dialogInput: CaProjectUserConfigDialogInput = {
      projectId: project.id
    };

    this.dialogService.openMediumDialog(CaProjectUserConfigDialogComponent, { data: dialogInput });
  }

  openDescription(project: CaProject): void {
    this.rightPanelState.updateRightPanelState({ type: 'description', objectId: project.id });
  }

  openChat(project: CaProject): void {
    this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: project.id });
  }

  openSettings(project: CaProject): void {
    this.rightPanelState.updateRightPanelState({ type: 'settings', objectId: project.id });
  }
}
