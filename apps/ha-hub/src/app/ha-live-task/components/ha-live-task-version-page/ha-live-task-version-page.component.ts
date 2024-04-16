import {Component, OnInit} from '@angular/core';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {HaBrickVersion} from '../../../ha-core/ha-model/ha-entities/ha-brick-version.class';
import {Observable} from 'rxjs';
import {HaNavigationPanelItem} from '../../../ha-core/ha-component/ha-navigation-panel/ha-navigation-panel.component';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';

@Component({
  selector: 'ha-live-task-version-page',
  templateUrl: './ha-live-task-version-page.component.html',
  styleUrls: ['./ha-live-task-version-page.component.scss']
})
export class HaLiveTaskVersionPageComponent implements OnInit {

  liveTaskVersion: HaLiveTaskVersion;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  isLoading: boolean = true;
  canEditChecked: boolean = false;
  canEdit: boolean = false;
  brickDependencies$: Observable<HaBrickVersion[]>;
  navPanelItems: HaNavigationPanelItem[];


  constructor(private liveTaskService: HaLiveTaskService,
              private activatedRoute: ActivatedRoute,
              private dialogService: FlDialogService,
              private snackBarService: FlSnackBarService,
              private authenticatedUserService: HaAuthenticatedUserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.setLiveTaskVersion(params['id'], params['versionNumber']);
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
        this.router.navigate([HaRouterService.getLiveTaskVersionRoute(this.liveTaskVersion)]);
      }
    });
  }

  private setLiveTaskVersion(liveTaskId: string, liveTaskVersionNumber: string): void {
    this.liveTaskService.getLiveTaskVersionByVersionNumber(liveTaskId, liveTaskVersionNumber).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.textEditorConfig =
        new HaLiveTaskTextEditorConfig(this.liveTaskService, this.liveTaskVersion.liveTask.id);
      this.authenticatedUserService.getUser().subscribe(user => {
        this.canEdit = user?.id === this.liveTaskVersion?.liveTask.createdBy.id;
        if (user && !this.canEdit) {
          this.checkIfCoAuthor(user);
        } else {
          this.canEditChecked = true;
        }
      });
      this.brickDependencies$ = this.liveTaskService.getLiveTaskVersionBrickDependencies(this.liveTaskVersion.id);
      this.navPanelItems = [
        {title: this.liveTaskVersion.liveTask.title},
        {title: 'versions_list', translateTitle: true},
        {title: `V${this.liveTaskVersion.version}`}
      ];
      this.isLoading = false;
    });
  }

  private checkIfCoAuthor(user: HaUser): void{
    this.liveTaskService.getCoAuthors(this.liveTaskVersion.liveTask.id).subscribe(coAuthors => {
      this.canEdit = coAuthors.some(coAuthor => coAuthor.id === user.id);
      this.canEditChecked = true;
    });
  }

  updateLiveTaskVersion(liveTaskVersion: HaLiveTaskVersion): void{
    this.liveTaskVersion = liveTaskVersion;
  }
}
