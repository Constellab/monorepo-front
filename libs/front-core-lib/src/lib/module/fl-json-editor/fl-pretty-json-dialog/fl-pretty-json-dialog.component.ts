import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FlTranslatableText} from '../../fl-translate/model/fl-translate-param';
import {FlClipboardService} from '../../../service/fl-clipboard.service';
import {FlSnackBarService} from '../../fl-snack-bar/fl-snack-bar.service';

export interface FlPrettyJsonDialogInput {
  title: FlTranslatableText;
  object: any;
}

@Component({
  selector: 'fl-pretty-json-dialog',
  templateUrl: './fl-pretty-json-dialog.component.html',
  styleUrls: ['./fl-pretty-json-dialog.component.scss']
})
export class FlPrettyJsonDialogComponent {

  title: FlTranslatableText;
  object: any;

  constructor(@Inject(MAT_DIALOG_DATA) input: FlPrettyJsonDialogInput,
              private clipboardService: FlClipboardService,
              private snackBarService: FlSnackBarService) {
    this.title = input.title;
    this.object = input.object;
  }

  copyToClipboard(): void {
    const result = this.clipboardService.copy(JSON.stringify(this.object, null, 2));
    if (result) {
      this.snackBarService.openSuccessMessage({text: 'flJsonEditor.json_copied_to_clipboard', translateText: true});
    }
  }

}
