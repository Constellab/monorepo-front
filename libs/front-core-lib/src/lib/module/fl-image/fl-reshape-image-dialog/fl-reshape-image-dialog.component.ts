import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface FlReshapeImageDialogInput {
  file: File;
  width: number;
  height: number;
}

@Component({
  selector: 'fl-reshape-image-dialog',
  templateUrl: './fl-reshape-image-dialog.component.html',
  styleUrls: ['./fl-reshape-image-dialog.component.scss']
})
export class FlReshapeImageDialogComponent implements OnInit {

  isLoading = false;
  fileLoading = true;
  file: File;
  imageUrl: string;
  width: number;
  height: number;

  constructor(@Inject(MAT_DIALOG_DATA) dialogInput: FlReshapeImageDialogInput,
              private dialogRef: MatDialogRef<FlReshapeImageDialogComponent>) {
    this.file = dialogInput.file;
    this.width = dialogInput.width;
    this.height = dialogInput.height;
  }

  ngOnInit(): void {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.fileLoading = false;
      };
      reader.readAsDataURL(this.file);
    }
  }

  save() {
    this.isLoading = true;
    this.dialogRef.close({choice: true, result: this.file});
  }
}
