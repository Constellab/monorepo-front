import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CaProjectDetailState } from '../../state/ca-project-detail.state';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaProject } from '../../../../../ca-core/model/entities/project/ca-project.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';

// TODO IMPROVE STYLE
@Component({
  selector: 'ca-project-settings',
  templateUrl: './ca-project-settings.component.html',
  styleUrls: ['./ca-project-settings.component.scss']
})
export class CaProjectSettingsComponent {

  state = inject(CaProjectDetailState);
  rightPanelState = inject(CaFolderRightPanelState);

  project$: Observable<CaProject> = this.state.getProject$();

  // only allow storage setting for root projects
  showStorageSettings$: Observable<boolean> = inject(CaProjectDetailState).isRootProject$();

  projectService = inject(CaProjectService);
  snackBarService = inject(FlSnackBarService);

  toggleChat(project: CaProject): void {
    this.projectService.activateChat(project.id, !project.chatEnabled).subscribe(
      (project: CaProject) => this.chatEnableSuccess(project)
    );
  }

  private chatEnableSuccess(project: CaProject): void {
    this.state.updateProject(project);
    if (project.chatEnabled) {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_activated', translateText: true });
      this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: project.id });
    } else {
      this.snackBarService.openSuccessMessage({ text: 'folder_chat_deactivated', translateText: true });
    }
  }
}
