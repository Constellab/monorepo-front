import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { FlSnackBarAction, FlSnackBarInfoInput, FlSnackBarMode } from '../../model/fl-snack-bar.class';

/**
 * Simple snack bar to display an error or success message
 */
@Component({
  selector: 'fl-snack-bar-info',
  templateUrl: './fl-snack-bar-info.component.html',
  styleUrls: ['./fl-snack-bar-info.component.scss'],
  standalone: false,
})
export class FlSnackBarInfoComponent {
  private data = inject<FlSnackBarInfoInput>(MAT_SNACK_BAR_DATA);
  private snackBarRef = inject<MatSnackBarRef<FlSnackBarInfoComponent>>(MatSnackBarRef);

  mode: FlSnackBarMode;
  text: FlTranslatableText;
  showCloseButton: boolean | undefined;
  action?: FlSnackBarAction;

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
    this.action = data.additionalConfig.action;
  }

  onActionClick(): void {
    this.action?.onClick();
    this.snackBarRef.dismiss();
  }

  closeSnackBar(): void {
    this.snackBarRef.dismiss();
  }
}
