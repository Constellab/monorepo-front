import { Component, OnInit, inject } from '@angular/core';
import { FlSnackBarInfoInput, FlSnackBarMode } from '../../model/fl-snack-bar.class';
import { FlTranslatableText } from '../../../fl-translate/model/fl-translate-param';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

/**
 * Simple snack bar to display an error or success message
 */
@Component({
  selector: 'fl-snack-bar-info',
  templateUrl: './fl-snack-bar-info.component.html',
  styleUrls: ['./fl-snack-bar-info.component.scss'],
  standalone: false,
})
export class FlSnackBarInfoComponent implements OnInit {
  private data = inject<FlSnackBarInfoInput>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject<MatSnackBarRef<FlSnackBarInfoComponent>>(MatSnackBarRef);

  mode: FlSnackBarMode;
  text: FlTranslatableText;
  showCloseButton: boolean;
  showDetailButton: boolean;

  constructor() {
    const data = this.data;

    if (data.mode == null) {
      console.error('The mode input is missing in the snack bar info');
    }
    if (data.text == null) {
      console.error('The text input is missing in the snack bar info');
    }

    this.mode = data.mode;
    this.text = data.text;
    this.showCloseButton = data.additionalConfig.showCloseButton;
    this.showDetailButton = data.additionalConfig.detailButton != null;
  }

  ngOnInit(): void {}

  closeSnackBar(): void {
    this.snackBarRef.dismiss();
  }

  openDetailDialog(event: MouseEvent): void {
    this.data.additionalConfig.detailButton(event);
  }
}
