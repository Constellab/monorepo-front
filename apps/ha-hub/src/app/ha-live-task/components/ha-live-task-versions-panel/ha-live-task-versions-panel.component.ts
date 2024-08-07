import {Component, Signal} from '@angular/core';
import {
  HaLiveTaskVersion,
  HaLiveTaskVersionFileInput
} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {FlConfirmDialogInput, FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {Router} from '@angular/router';
import {HaLiveTaskPageState} from '../../state/ha-live-task-page.state';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';

@Component({
  selector: 'ha-live-task-versions-panel',
  templateUrl: './ha-live-task-versions-panel.component.html',
  styleUrls: ['./ha-live-task-versions-panel.component.scss']
})
export class HaLiveTaskVersionsPanelComponent {

  canEditLt: Signal<boolean> = this.liveTaskPageState.canEditLt;
  liveTask: Signal<HaLiveTask> = this.liveTaskPageState.getLiveTask();
  liveTaskVersions: Signal<HaLiveTaskVersion[]> = this.liveTaskPageState.getLiveTaskVersionsList();
  inputFile: any;

  constructor(private liveTaskService: HaLiveTaskService,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private router: Router,
              private liveTaskPageState: HaLiveTaskPageState) {
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
      let isReplace = false;
      reader.onload = (e: any) => {
        const srcResult: HaLiveTaskVersionFileInput = JSON.parse(e.target.result);
        if(!HaLiveTaskVersionFileInput.isValid(srcResult)){
          this.snackBarService.openErrorMessage({text: 'file_wrong_format', translateText: true});
          return;
        }
        let inputData: FlConfirmDialogInput;
        if (this.liveTaskVersions() && this.liveTaskVersions()[0].versionState == 'PUBLISHED') {
          inputData = {
            title: 'create_new_live_task_version',
            content: 'create_new_live_task_version_content',
            successMessage: 'live_task_version_created',
            translateTitleAndContent: true,
            translateMessage: true,
            observable: this.liveTaskService.createNewDraftVersion(this.liveTask().id, srcResult)
          }
        } else {
          isReplace = true;
          inputData = {
            title: 'replace_not_published_live_task_version',
            content: 'replace_not_published_live_task_version_content',
            successMessage: 'live_task_version_replaced',
            translateTitleAndContent: true,
            translateMessage: true,
            observable: this.liveTaskService.replaceDraftVersion(this.liveTask().id, srcResult)
          }
        }
        this.dialogService.openConfirmDialog(inputData).afterClosed().subscribe((result) => {
          if (result.result) {
            if(!isReplace){
              this.liveTaskPageState.addLiveTaskVersionToList(result.result);
            }
            this.router.navigate([HaRouterService.getLiveTaskVersionRoute(result.result)]);
          }
        });
      }

      reader.readAsText(event);
    }
  }
}
