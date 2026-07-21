import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlCompressBlobOption, FlImageHelper } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

export interface FlUploadImageDialogInput {
  config: FlUploadImageDialogConfig;
  file: File;
}

export interface FlUploadImageDialogConfig {
  title: FlTranslatableText;
  helpText?: FlTranslatableText;
  /**
   * Width and height of the image in the preview
   */
  imagePreviewWidth: number;
  imagePreviewHeight: number;
  /**
   * Options to compress the image
   */
  compressOptions?: FlCompressBlobOption;
  /**
   * Method to upload the image
   * @param file
   */
  uploadImage: (file: File) => Observable<any>;
  uploadImageSuccessMessage?: FlTranslatableText;
  /**
   * If true the image will be rounded in the preview
   */
  roundImage?: boolean;
}

/**
 * Output of the upload image dialog
 */
export interface FlUploadImageDialogOutput<T = any> {
  choice: boolean;
  result: T;
}

@Component({
  selector: 'fl-upload-image-dialog',
  templateUrl: './fl-upload-image-dialog.component.html',
  styleUrls: ['./fl-upload-image-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlUploadImageDialogComponent implements OnInit {
  dialogInput = inject<FlUploadImageDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<FlUploadImageDialogComponent>>(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  compressIsLoading = true;

  uploadIsLoading = false;

  compressImageSrc: string;
  compressImage: File;

  ngOnInit(): void {
    this.onNewFile(this.dialogInput.file).then();
  }

  async onNewFile(file: File): Promise<void> {
    this.compressImageSrc = null;
    this.compressImage = null;
    try {
      if (this.dialogInput.config.compressOptions) {
        this.compressImage = await FlImageHelper.compressBlob(file, this.dialogInput.config.compressOptions);
      } else {
        this.compressImage = file;
      }
      this.compressImageSrc = URL.createObjectURL(this.compressImage);
    } catch {
      this.snackBarService.openErrorMessage({ text: 'flImage.file_is_not_image', translateText: true });
    }
    this.compressIsLoading = false;
  }

  save(): void {
    this.uploadIsLoading = true;
    this.dialogInput.config.uploadImage(this.compressImage).subscribe({
      next: (result) => this.saveSuccess(result),
      error: () => (this.uploadIsLoading = false),
    });
  }

  private saveSuccess(result: any): void {
    if (this.dialogInput.config.uploadImageSuccessMessage) {
      this.snackBarService.openSuccessMessage(this.dialogInput.config.uploadImageSuccessMessage);
    }
    this.dialogRef.close({ choice: true, result } as FlUploadImageDialogOutput);
    this.uploadIsLoading = false;
  }
}
