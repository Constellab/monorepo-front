import { ChangeDetectorRef, Component, OnInit, Signal } from '@angular/core';
import { HaLiveTaskVersion } from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import { HaLiveTaskService } from '../../../ha-core/ha-service/ha-live-task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlDialogService, FlSnackBarService } from '@monorepo/front-core-lib';
import { HaRouterService } from '../../../ha-core/ha-service/ha-router.service';
import { HaLiveTaskPageState } from '../../state/ha-live-task-page.state';

@Component({
  selector: 'ha-live-task-version-page',
  templateUrl: './ha-live-task-version-page.component.html',
  styleUrls: ['./ha-live-task-version-page.component.scss']
})
export class HaLiveTaskVersionPageComponent implements OnInit {


  liveTaskVersion: Signal<HaLiveTaskVersion> = this.liveTaskPageState.liveTaskVersion;
  canEdit: Signal<boolean> = this.liveTaskPageState.canEditLt;
  isLiveTaskVersionError: Signal<boolean> = this.liveTaskPageState.isLiveTaskVersionError;
  isLiveTaskVersionLoading: Signal<boolean> = this.liveTaskPageState.isLiveTaskVersionLoading;
  currentVersion: any = null;

  constructor(private liveTaskService: HaLiveTaskService,
              private activatedRoute: ActivatedRoute,
              private dialogService: FlDialogService,
              private snackBarService: FlSnackBarService,
              private router: Router,
              private liveTaskPageState: HaLiveTaskPageState,
              private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.currentVersion = null;
      this.changeDetector.detectChanges();
      this.currentVersion = params['versionNumber'];
      this.liveTaskPageState.setLiveTaskVersionByVersionNumber(params['id'], params['versionNumber']);
    });
  }

  publishLiveTaskVersion(): void {
    if (this.liveTaskVersion().versionState === 'PUBLISHED') return;
    if (this.liveTaskVersion().code == null || this.liveTaskVersion().code === '') {
      this.snackBarService.openErrorMessage({
        text: 'cannot_publish_live_task_version_without_code',
        translateText: true
      })
      return;
    }
    this.dialogService.openConfirmDialog({
      title: 'publish_live_task_version',
      content: 'publish_live_task_version_confirmation',
      successMessage: 'live_task_version_published',
      observable: this.liveTaskService.publishLiveTaskVersion(this.liveTaskVersion().id)
    }).afterClosed().subscribe((result) => {
      if (result.choice && result.result != null) {
        this.liveTaskPageState.updateLiveTaskVersion(result.result);
        this.router.navigate([HaRouterService.getLiveTaskRoute(this.liveTaskVersion().liveTask.id, this.liveTaskVersion().liveTask.title)]);
      }
    });
  }

  updateLiveTaskVersion(liveTaskVersion: HaLiveTaskVersion): void {
    this.liveTaskPageState.setLiveTaskVersion(liveTaskVersion);
  }

  deleteLiveTaskVersion(): void {
    //TODO: Check if last version with the state
    this.dialogService.openConfirmDialog({
      title: 'delete_live_task_version',
      content: 'delete_live_task_version_confirmation',
      successMessage: 'live_task_version_deleted',
      observable: this.liveTaskService.deleteLiveTaskVersion(this.liveTaskVersion().id)
    }).afterClosed().subscribe((result) => {
      if (result.choice) {
        this.router.navigate([HaRouterService.getLiveTaskRoute(this.liveTaskVersion().liveTask.id, this.liveTaskVersion().liveTask.title)]).then(()=>{
          this.liveTaskPageState.removeLiveTaskVersionToList(this.liveTaskVersion());
        });
      }
    });
  }
}
