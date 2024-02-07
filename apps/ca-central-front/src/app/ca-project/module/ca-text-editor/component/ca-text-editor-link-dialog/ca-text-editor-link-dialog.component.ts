import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@ngneat/reactive-forms';
import {AbstractControl, ValidatorFn, Validators} from '@angular/forms';
import {ClYoutubeHelper} from '@monorepo/core-lib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


export interface CaTextEditorLinkDialogInput {
  title: string;
}


@Component({
  selector: 'ca-text-editor-link-dialog',
  templateUrl: './ca-text-editor-link-dialog.component.html'
})
export class CaTextEditorLinkDialogComponent implements OnInit {

  linkControl: FormControl<string>;

  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: CaTextEditorLinkDialogInput,
              private dialogRef: MatDialogRef<CaTextEditorLinkDialogComponent>) {
    this.title = data.title;
  }

  ngOnInit(): void {
    this.linkControl = new FormControl<string>(null, [Validators.required, this.isYoutubeVideo()]);
  }

  submit(): void {
    if (this.linkControl.valid) {
      this.dialogRef.close(this.linkControl.value);
    }
  }

  public isYoutubeVideo(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value: string = control.value;
      if (value == null || value.length === 0) {
        return null;
      }

      if (!ClYoutubeHelper.isYoutubeVideoOrEmbedUrl(value)) {
        return {notYoutube: 'caTextEditor.not_youtube_link_error'};
      }
      return null;
    };
  }
}
