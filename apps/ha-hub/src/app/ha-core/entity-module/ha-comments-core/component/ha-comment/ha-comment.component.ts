import {Component, Input} from '@angular/core';
import {HaCommentTextEditorConfig} from '../../model/ha-comment-text-editor.config';

@Component({
  selector: 'ha-comment',
  templateUrl: './ha-comment.component.html',
  styleUrls: ['./ha-comment.component.scss']
})
export class HaCommentComponent {
  @Input() comment: any;

  textEditorConfig: HaCommentTextEditorConfig = new HaCommentTextEditorConfig();
}
