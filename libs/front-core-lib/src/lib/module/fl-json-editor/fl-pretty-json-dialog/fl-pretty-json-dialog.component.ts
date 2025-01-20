import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlTranslatableText } from '../../fl-translate/model/fl-translate-param';
import { FlClipboardService } from '../../../service/fl-clipboard.service';

export interface FlPrettyJsonDialogInput {
  title: FlTranslatableText;
  object: any;
}

@Component({
    selector: 'fl-pretty-json-dialog',
    templateUrl: './fl-pretty-json-dialog.component.html',
    styleUrls: ['./fl-pretty-json-dialog.component.scss'],
    standalone: false
})
export class FlPrettyJsonDialogComponent {
  title: FlTranslatableText;
  object: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) input: FlPrettyJsonDialogInput,
    private clipboardService: FlClipboardService
  ) {
    this.title = input.title;
    this.object = input.object;
  }

  copyToClipboard(): void {
    this.clipboardService.copy(JSON.stringify(this.object, null, 2), {
      text: 'flJsonEditor.json_copied_to_clipboard',
      translateText: true,
    });
  }
}
