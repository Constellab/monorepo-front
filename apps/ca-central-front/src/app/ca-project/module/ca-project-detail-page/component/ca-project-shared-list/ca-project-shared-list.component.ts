import {Component, Inject} from '@angular/core';
import {FlArrayObs, FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {
  CaGroupShareDialogComponent,
  CaGroupShareDialogInput
} from '../../../../../ca-core/entity-module/ca-group-core/component/ca-group-share-dialog/ca-group-share-dialog.component';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CaUser} from '../../../../../ca-core/model/entities/ca-user.class';
import {CaProjectDetailState} from '../../state/ca-project-detail.state';

export interface CaProjectSharedGroupsListInput {
  projectId: string;
  canEdit$: Observable<boolean>;
}

/**
 * Component to list the user where the project is shared with. with button to share or unshare
 */
@Component({
  selector: 'ca-project-shared-list',
  templateUrl: './ca-project-shared-list.component.html',
  styleUrls: ['./ca-project-shared-list.component.scss'],
})
export class CaProjectSharedListComponent {

  canEdit$: Observable<boolean>;

  users$: FlArrayObs = this.state.getUsers();

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaProjectSharedGroupsListInput,
              private state: CaProjectDetailState,
              private projectService: CaProjectService,
              private dialogService: FlDialogService) {
    this.canEdit$ = input.canEdit$;
  }


  openShareDialog(): void {
    const input: CaGroupShareDialogInput = {
      share: group => this.projectService.shareProject(this.input.projectId, group.id)
    };

    this.dialogService.openSmallDialog(CaGroupShareDialogComponent, {data: input}).afterClosed().subscribe(
      group => this.onShareDialogClosed(group)
    );
  }

  private onShareDialogClosed(users: CaUser[]): void {
    if (users) {
      this.users$.array = users;
    }
  }

  openUnshareDialog(user: CaUser): void {
    const input: FlConfirmDialogInput = {
      title: 'unshare',
      content: 'unshare_confirmation',
      translateTitleAndContent: true,
      observable: this.projectService.unshareProject(this.input.projectId, user.id),
      successMessage: 'unshared',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onRemoveSharingClosed(result, user)
    );
  }

  private onRemoveSharingClosed(result: FlConfirmDialogResult, user: CaUser): void {
    if (result.choice) {
      this.users$.removeItem(user);
    }
  }

}
