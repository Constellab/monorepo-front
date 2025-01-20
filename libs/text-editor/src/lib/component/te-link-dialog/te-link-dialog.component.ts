import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ClYoutubeHelper } from '@monorepo/core-lib';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface TeLinkDialogInput {
  title: string;
  isYoutube?: boolean;
}

@Component({
    selector: 'te-link-dialog',
    templateUrl: './te-link-dialog.component.html',
    styleUrls: ['./te-link-dialog.component.scss'],
    standalone: false
})
export class TeLinkDialogComponent implements OnInit {
  linkControl: FormControl<string>;

  title: string;

  isYoutube: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: TeLinkDialogInput,
    private dialogRef: MatDialogRef<TeLinkDialogComponent>
  ) {
    this.title = data.title;
    this.isYoutube = data.isYoutube;
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

      if (!this.isYoutube) {
        return null;
      }

      if (value == null || value.length === 0) {
        return null;
      }

      if (!ClYoutubeHelper.isYoutubeUrl(value)) {
        return { notYoutube: 'teTextEditor.not_youtube_link_error' };
      }
      return null;
    };
  }
}
