import {Component, OnInit} from '@angular/core';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {
  HaLiveTaskVersion,
  HaLiveTaskVersionFileInput
} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {ActivatedRoute} from '@angular/router';
import {FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';

@Component({
  selector: 'ha-live-task-versions',
  templateUrl: './ha-live-task-versions.component.html',
  styleUrls: ['./ha-live-task-versions.component.scss'],
})
export class HaLiveTaskVersionsComponent implements OnInit {

  liveTaskVersions: HaLiveTaskVersion[];
  liveTask: HaLiveTask;
  isLiveTaskOwner: boolean;
  inputFile: any;
  isLoading = true;

  constructor(
    private liveTaskService: HaLiveTaskService,
    private activatedRoute: ActivatedRoute,
    private snackBarService: FlSnackBarService,
    private authenticatedUserService: HaAuthenticatedUserService,
    private dialogService: FlDialogService) {
  }

  ngOnInit(): void {
    this.authenticatedUserService.getUser().subscribe((user) => {
      this.liveTaskService.getLiveTaskById(this.activatedRoute.snapshot.params['id']).subscribe(liveTask => {
        this.liveTask = liveTask;
        this.isLiveTaskOwner = user && user.id === liveTask?.createdBy.id;
      });
    });

    this.liveTaskService.getPublishedLiveTaskVersions(this.activatedRoute.snapshot.params['id']).subscribe(liveTaskVersions => {
      this.liveTaskVersions = liveTaskVersions;
      this.isLoading = false;
    });
  }

  onCopyCode(liveTaskVersion: HaLiveTaskVersion, e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(liveTaskVersion.code).then(() => {
      this.snackBarService.openSuccessMessage({text: 'code_copied_to_clipboard', translateText: true});
    }).catch(() => {
      console.log('Error copying code to clipboard');
    });
  }

  onCopyLink(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
  }

  onFileSelected(event: any): void {
    this.inputFile = null;
    if (event == null) {
      return;
    }
    if (!event.name.endsWith('.json')) {
      this.snackBarService.openErrorMessage({text: 'file_wrong_type', translateText: true});
      return;
    }

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const srcResult: HaLiveTaskVersionFileInput = JSON.parse(e.target.result);
        if(!HaLiveTaskVersionFileInput.isValid(srcResult)){
          this.snackBarService.openErrorMessage({text: 'file_wrong_format', translateText: true});
          return;
        }
        this.dialogService.openConfirmDialog({
          title: 'create_new_live_task_version',
          content: 'create_new_live_task_version_content',
          successMessage: 'live_task_version_created',
          translateTitleAndContent: true,
          translateMessage: true,
          observable: this.liveTaskService.createNewDraftVersion(this.liveTask.id, srcResult)
        }).afterClosed().subscribe((result) => {
          if (result.result) {
            this.liveTaskVersions = [result.result].concat(this.liveTaskVersions);
          }
        });
      }

      reader.readAsText(event);
    }
  }

  openNewLiveTaskVersionDto(): void {

  }

  latestVersionIsPublished(): boolean {
    return this.liveTaskVersions && this.liveTaskVersions[0]?.versionState === 'PUBLISHED';
  }
}
