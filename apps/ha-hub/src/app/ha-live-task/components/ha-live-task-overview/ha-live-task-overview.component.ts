import {Component, OnInit} from '@angular/core';
import {HaLiveTaskTextEditorConfig} from '../ha-live-task-core/ha-live-task-text-editor.config';
import {FormControl} from '@ngneat/reactive-forms';
import {HaLiveTask, HaLiveTaskCoAuthor} from '../../../ha-core/ha-model/ha-entities/ha-live-task.class';
import {HaLiveTaskVersion} from '../../../ha-core/ha-model/ha-entities/ha-live-task-version.class';
import {HaLiveTaskService} from '../../../ha-core/ha-service/ha-live-task.service';
import {ActivatedRoute} from '@angular/router';
import {HaAuthenticatedUserService} from '../../../ha-core/ha-service/ha-authenticated-user.service';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaUser} from '../../../ha-core/ha-model/ha-entities/ha-user';

@Component({
  selector: 'ha-live-task-overview',
  templateUrl: './ha-live-task-overview.component.html',
  styleUrls: ['./ha-live-task-overview.component.scss'],
})
export class HaLiveTaskOverviewComponent implements OnInit {

  liveTask: HaLiveTask;
  liveTaskVersion: HaLiveTaskVersion;
  textEditorConfig: HaLiveTaskTextEditorConfig;
  descriptionFormControl: FormControl<TeRichTextContent> = new FormControl<TeRichTextContent>();
  descriptionEditorDisabled: boolean = true;
  canEditLt: boolean = false;
  isLoading: boolean = true;
  liveTaskCoAuthors: HaUser[];
  constructor(
    private liveTaskService: HaLiveTaskService,
    private activeRoute: ActivatedRoute,
    private authenticatedUserService: HaAuthenticatedUserService) {
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.setupLiveTask(params['id'])
      this.setupLatestLiveTaskVersion(params['id']);
    });
  }

  setupLatestLiveTaskVersion(id: string): void {
    this.liveTaskService.getLatestLiveTaskVersionByLiveTaskId(id).subscribe(liveTaskVersion => {
      this.liveTaskVersion = liveTaskVersion;
      this.isLoading = false;
    });
  }

  private setupLiveTask(id: string): void {
    this.liveTaskService.getLiveTaskById(id).subscribe(liveTask => {
      if(!liveTask) return;
      this.liveTask = liveTask;
      this.textEditorConfig = new HaLiveTaskTextEditorConfig(this.liveTaskService, this.liveTask.id);
      this.descriptionFormControl.setValue(this.liveTask?.description);
      this.descriptionFormControl.disable();
      this.setupCoAuthors();
    });
  }

  private setupCoAuthors(): void{
    this.liveTaskService.getCoAuthors(this.liveTask.id).subscribe(coAuthors => {
      this.liveTaskCoAuthors = coAuthors;
      this.setupCanEdit();
    });
  }

  private setupCanEdit():void{
    this.authenticatedUserService.getUser().subscribe(user => {
      this.canEditLt = (user?.id === this.liveTask?.createdBy.id ||
        this.liveTaskCoAuthors?.some(coAuthor => coAuthor.id === user?.id));
    });
  }

  onDescriptionChange(description: TeRichTextContent): void {
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
