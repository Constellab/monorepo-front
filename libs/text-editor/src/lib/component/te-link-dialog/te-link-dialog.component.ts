import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClYoutubeHelper } from '@monorepo/core-lib';

export interface TeLinkDialogInput {
  title: string;
  isYoutube?: boolean;
}

@Component({
  selector: 'te-link-dialog',
  templateUrl: './te-link-dialog.component.html',
  styleUrls: ['./te-link-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TeLinkDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<TeLinkDialogComponent>>(MatDialogRef);

  linkControl: FormControl<string>;

  title: string;

  isYoutube: boolean;

  constructor() {
    const data = inject<TeLinkDialogInput>(MAT_DIALOG_DATA);

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
