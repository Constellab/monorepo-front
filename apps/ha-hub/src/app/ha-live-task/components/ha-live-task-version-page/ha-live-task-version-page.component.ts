import {Component, OnInit} from '@angular/core';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute} from '@angular/router';
import {FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';
import {HaNavigationPanelItem} from '../../../ha-core/ha-component/ha-navigation-panel/ha-navigation-panel.component';

@Component({
  selector: 'ha-live-task-version-page',
  templateUrl: './ha-live-task-version-page.component.html',
  styleUrls: ['./ha-live-task-version-page.component.scss']
})
export class HaLiveTaskVersionPageComponent implements OnInit {

  liveTaskVersion: HaLiveTaskVersion;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  isLoading: boolean = true;
  isCreator: boolean = false;
  brickDependencies$: Observable<HaBrickVersion[]>;
  navPanelItems: HaNavigationPanelItem[];


  constructor(private liveTaskService: HaLiveTaskService,
              private activatedRoute: ActivatedRoute,
              private dialogService: FlDialogService,
              private snackBarService: FlSnackBarService,
              private authenticatedUserService: HaAuthenticatedUserService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.setLiveTaskVersion(params['versionId']);
    });
  }

  publishLiveTaskVersion(): void {
    if (this.liveTaskVersion.versionState === 'PUBLISHED') return;
    if (this.liveTaskVersion.code == null || this.liveTaskVersion.code === '') {
      this.snackBarService.openErrorMessage({
        text: 'cannot_publish_live_task_version_without_code',
        translateText: true
      })
      return;
    }
    this.dialogService.openConfirmDialog({
      title: 'publish_live_task_version',
      content: 'publish_live_task_version_confirmation',
      translateTitleAndContent: true,
      successMessage: 'live_task_version_published',
      translateMessage: true,
      observable: this.liveTaskService.publishLiveTaskVersion(this.liveTaskVersion.id),
    }).afterClosed().subscribe((result) => {
      if (result.choice && result.result != null) {
        this.liveTaskVersion = result.result;
      }
    });
  }

  private setLiveTaskVersion(liveTaskVersionId: string): void {
    this.liveTaskService.getLiveTaskVersionById(liveTaskVersionId).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.textEditorConfig =
        new HaLiveTaskTextEditorConfig(this.liveTaskService, this.dialogService, this.liveTaskVersion.liveTask.id);
      this.authenticatedUserService.getUser().subscribe(user => {
        this.isCreator = user?.id === this.liveTaskVersion?.liveTask.createdBy.id;
      });
      this.brickDependencies$ = this.liveTaskService.getLiveTaskVersionBrickDependencies(liveTaskVersionId);
      this.navPanelItems = [
        {title: this.liveTaskVersion.liveTask.title},
        {title: 'versions_list', translateTitle: true},
        {title: `V${this.liveTaskVersion.version}`}
      ];
      this.isLoading = false;
    });
  }

  updateLiveTaskVersion(liveTaskVersion: HaLiveTaskVersion): void{
    this.liveTaskVersion = liveTaskVersion;
  }
}
