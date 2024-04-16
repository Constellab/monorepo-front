import {Component, Input, OnInit} from '@angular/core';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {
  HaLiveTaskVersion,
  HaLiveTaskVersionFileInput
} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {FlDialogService, FlSnackBarService} from '@monorepo/front-core-lib';
import {HaRouterService} from '../../../ha-core/ha-service/ha-router.service';
import {Router} from '@angular/router';

@Component({
  selector: 'ha-live-task-versions-panel',
  templateUrl: './ha-live-task-versions-panel.component.html',
  styleUrls: ['./ha-live-task-versions-panel.component.scss']
})
export class HaLiveTaskVersionsPanelComponent implements OnInit{

  @Input() liveTask: HaLiveTask;
  @Input() canEditLt: boolean;
  liveTaskVersions: HaLiveTaskVersion[];
  inputFile: any;
  isLoading = true;

  constructor(private liveTaskService: HaLiveTaskService,
              private snackBarService: FlSnackBarService,
              private dialogService: FlDialogService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.liveTaskService.getPublishedLiveTaskVersions(this.liveTask.id).subscribe(liveTaskVersions => {
      this.liveTaskVersions = liveTaskVersions;
      this.isLoading = false;
    });
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
            this.router.navigate([HaRouterService.getLiveTaskVersionRoute(result.result)]);
          }
        });
      }

      reader.readAsText(event);
    }
  }
}
