import {Component, OnInit} from '@angular/core';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTask} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute} from '@angular/router';
import {FlDialogService} from '@monorepo/front-core-lib';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';

@Component({
  selector: 'ha-live-task-overview',
  templateUrl: './ha-live-task-overview.component.html',
  styleUrls: ['./ha-live-task-overview.component.scss'],
})
export class HaLiveTaskOverviewComponent implements OnInit {

  liveTask: HaLiveTask;
  liveTaskVersion: HaLiveTaskVersion;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  descriptionFormControl: FormControl<Record<string, any>> = new FormControl<Record<string, any>>(null);
  descriptionEditorDisabled: boolean = true;
  isCreator: boolean = false;
  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private dialogService: FlDialogService,
    private authenticatedUserService: HaAuthenticatedUserService
  ) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.liveTaskService.getLiveTaskById(params['id']).subscribe(liveTask => {
        this.liveTask = liveTask;
        this.textEditorConfig = new HaLiveTaskTextEditorConfig(this.liveTaskService, this.dialogService, this.liveTask?.id);
        this.descriptionFormControl.setValue(this.liveTask?.description);
        this.descriptionFormControl.disable();
        this.authenticatedUserService.getUser().subscribe(user => {
          this.isCreator = user?.id === this.liveTask?.createdBy.id;
        });
      });
      this.liveTaskService.getLatestLiveTaskVersionByLiveTaskId(params['id']).subscribe(liveTaskVersion => {
        this.liveTaskVersion = liveTaskVersion;
      });
    });
  }


  onDescriptionChange(description: Record<string, any>): void {
    this.liveTask.description = description;
  }

  onDescriptionEditorButtonClick(): void {
    if (this.descriptionEditorDisabled) {
      this.descriptionEditorDisabled = false;
      this.descriptionFormControl.enable();
      return;
    }

    this.liveTaskService.saveLiveTaskDescription(this.liveTask.id, this.liveTask.description).subscribe((liveTask) => {
      if (liveTask) {
        this.liveTask = liveTask;
        if (this.liveTaskVersion)
          this.liveTaskVersion.liveTask = liveTask;
      }
      this.descriptionEditorDisabled = true;
      this.descriptionFormControl.disable();
    })
  }
}
