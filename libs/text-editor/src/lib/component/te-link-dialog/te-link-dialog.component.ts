import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClYoutubeHelper } from '@monorepo/core-lib';

export interface TeLinkDialogInput {
  title: string;
  isYoutube?: boolean;
  initialValue?: string;
}

@Component({
  selector: 'te-link-dialog',
  templateUrl: './te-link-dialog.component.html',
  styleUrls: ['./te-link-dialog.component.scss'],
  standalone: false,
})
export class TeLinkDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<TeLinkDialogComponent>>(MatDialogRef);

  private data = inject<TeLinkDialogInput>(MAT_DIALOG_DATA);

  linkControl: FormControl<string>;

  title: string;

  isYoutube: boolean;

  constructor() {
    this.title = this.data.title;
    this.isYoutube = this.data.isYoutube;
  }

  ngOnInit(): void {
    this.linkControl = new FormControl<string>(this.data.initialValue || null, [
      Validators.required,
      this.isYoutubeVideo(),
    ]);
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
