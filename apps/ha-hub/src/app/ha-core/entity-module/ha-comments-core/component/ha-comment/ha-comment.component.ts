import {Component, Input} from '@angular/core';
import {TeOnlyInlineConfig} from '@monorepo/text-editor';

@Component({
  selector: 'ha-comment',
  templateUrl: './ha-comment.component.html',
  styleUrls: ['./ha-comment.component.scss']
})
export class HaCommentComponent {
  @Input() comment: any;

  textEditorConfig: TeOnlyInlineConfig = new TeOnlyInlineConfig();

  constructor() {
  }
}
