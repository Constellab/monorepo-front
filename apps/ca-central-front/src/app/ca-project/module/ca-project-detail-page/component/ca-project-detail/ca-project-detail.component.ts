import {Component, ViewContainerRef} from '@angular/core';
import {CaProject} from '../../../../../ca-core/model/entities/project/ca-project.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {CaProjectDetailRightPanel, CaProjectDetailState} from '../../state/ca-project-detail.state';
import {Observable} from 'rxjs';
import {CaUser} from '../../../../../ca-core/model/entities/ca-user.class';
import {
  CaProjectSharedGroupsListInput,
  CaProjectSharedListComponent
} from '../ca-project-shared-list/ca-project-shared-list.component';
import {map} from 'rxjs/operators';
import {CaRouterService} from '../../../../../ca-core/service/ca-router.service';
import {
  CaProjectUserConfigDialogComponent,
  CaProjectUserConfigDialogInput
} from '../ca-project-user-config-dialog/ca-project-user-config-dialog.component';

/**
 * Show detailed information for a project , used in ProjectDetailPage
 */
@Component({
  selector: 'ca-project-detail',
  templateUrl: './ca-project-detail.component.html',
  styleUrls: ['./ca-project-detail.component.scss']
})
export class CaProjectDetailComponent {

  projectId$: Observable<string> = this.state.getProjectId$();
  project$: Observable<CaProject> = this.state.getProject$();
  projectUsers$: Observable<CaUser[]> = this.state.getUsers().connect();
  rightPanelState$: Observable<CaProjectDetailRightPanel> = this.state.getRightPanelState$();

  isRootProject$: Observable<boolean> = this.state.getProject$().pipe(
    map(project => project.isRoot())
  );
  canEditProject$: Observable<boolean> = this.state.canEditProject$();

  commentQueryParams: CaProjectDetailRightPanel = {type: 'comments', objectId: null};
  descriptionQueryParams: CaProjectDetailRightPanel = {type: 'description', objectId: null};

  constructor(private dialogService: FlDialogService,
              private state: CaProjectDetailState,
              private routerService: CaRouterService,
              private viewContainerRef: ViewContainerRef) {
  }


  onProjectUpdated(project: CaProject): void {
    this.state.updateCurrentProject(project);
  }

  onProjectDeleted(project: CaProject): void {
    if (project.parentId != null) {
      this.routerService.navigateToProjectDetail(project.parentId);
    } else {
      this.routerService.navigateToDashboard();
    }
  }

  onChildCreated(project: CaProject): void {
    this.state.addChild(project);
  }


  openShareDialog(project: CaProject): void {
    const input: CaProjectSharedGroupsListInput = {
      projectId: project.id,
      canEdit$: this.state.canEditProject$()
    };

    this.dialogService.openSmallDialog(CaProjectSharedListComponent,
      {data: input, viewContainerRef: this.viewContainerRef, autoFocus: false});
  }

  openUserConfigDialog(project: CaProject): void{
    const dialogInput: CaProjectUserConfigDialogInput = {
      projectId: project.id,
    }

    this.dialogService.openMediumDialog(CaProjectUserConfigDialogComponent, {data: dialogInput});
  }
}
