import {Component, Inject, OnInit} from '@angular/core';
import {
  FlDialogService,
  FlFormDialogAbstractDirective,
  FlFormDialogInput, FlPortalAction, FlPortalActionsService,
  FlSnackBarService, FlTranslateService
} from '@monorepo/front-core-lib';
import {HaStory} from '../../../ha-core/ha-model/ha-entities/ha-story.class';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HaStoryService} from '../../../ha-core/ha-service/ha-story.service';
import {FormBuilder, FormGroup} from '@ngneat/reactive-forms';
import {Observable} from 'rxjs';
import {Validators} from '@angular/forms';
import {ClHelpService} from '@monorepo/core-lib';
import {HaFile} from '../../../ha-core/ha-model/ha-entities/ha-file';
import {HaFileHelper} from '../../../ha-core/ha-helper/ha-file.helper';

export type HaStoryFileDialogInput = FlFormDialogInput<HaStoryFileFormData>;

export interface HaStoryFileFormData {
  newStoryFiles?: File[];
  story: HaStory;
}

@Component({
  selector: 'ha-story-file-dialog',
  templateUrl: './ha-story-file-dialog.component.html',
  styleUrls: ['./ha-story-file-dialog.component.scss'],
})
export class HaStoryFileDialogComponent extends FlFormDialogAbstractDirective<HaStoryFileFormData, HaStory> implements OnInit {

  story: HaStory;
  storyId: string

  constructor(snackBarService: FlSnackBarService,
              dialogRef: MatDialogRef<HaStoryFileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) dialogInput: HaStoryFileDialogInput,
              private storyService: HaStoryService,
              private translateService: FlTranslateService,
              private actionService: FlPortalActionsService) {
    super(dialogInput, snackBarService, dialogRef);
    this.storyId = dialogInput.object.story.id;
  }

  buildForm(): FormGroup<HaStoryFileFormData> {
    return new FormBuilder().group({
      newDocFiles: [null, Validators.required],
      story: [this.story, Validators.required]
    });
  }

  create(formValue: HaStoryFileFormData): Observable<HaStory> {
    return undefined;
  }

  getCreateSuccessMessage(): string {
    return '';
  }

  getUpdateSuccessMessage(): string {
    return '';
  }

  update(formValue: HaStoryFileFormData): Observable<HaStory> {
    return undefined;
  }

  uploadDocument(event: File | File[]): void{
    this.formGp.controls.newStoryFiles.patchValue(ClHelpService.convertObjectOrArrayToArray(event));

    for (const file of this.formGp.controls.newStoryFiles.value) {

      const action: FlPortalAction = {
        type: 'upload-story-document',
        action: this.storyService.uploadDocument(file, this.story.id),
        text: this.translateService.translate('uploading_document',
          {param: {name: file.name}}),
        additionalInformation: this.story.id
      };

      this.actionService.addAction(action, false);
    }
  }

  ngOnInit(): void {
    this.storyService.getById(this.storyId).subscribe((story) => {
      this.story = story;
    })
    this.formGp = this.buildForm();
    this.actionService.getResult$('upload-story-document').subscribe(action => {
      if (action?.status === 'success') {
        this.onDocumentUploaded(action.result, action.additionalInformation);
      }
    });
  }

  onDocumentUploaded(result: any, storyId: string): void {
    this.storyService.getById(storyId).subscribe((story) => {
      this.story = story;
    });
  }

  deleteFile(file: HaFile): void{
    this.story.storyFiles = this.story.storyFiles.filter((storyFile) => storyFile.id !== file.id);

    const action: FlPortalAction = {
      type: 'delete-story-document',
      action: this.storyService.deleteStoryFile(file.id),
      text: this.translateService.translate('deleting_document',
        {param: {name: file.humanName}}),
      additionalInformation: this.story.id
    };

    this.actionService.addAction(action, false);
  }

  renameFile(event: string, file: HaFile): void{
    this.storyService.renameStoryFile(file.id, event).subscribe((storyFile: HaFile) => {
      if(storyFile){
        this.story.storyFiles = this.story.storyFiles.map((storyFile) => {
          if(storyFile.id === file.id){
            return storyFile;
          }
          return storyFile;
        });
      }
    });
  }

  getFileIcon(humanName: string): string{
    return HaFileHelper.getFileIcon(humanName);
  }

}
