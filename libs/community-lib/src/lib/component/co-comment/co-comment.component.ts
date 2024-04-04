import {Component, Input} from '@angular/core';
import {CoAbstractComment, CoCommentEntity} from '../../model/co-abstract-comment.class';
import {TeBasicConfig} from '@monorepo/text-editor';

@Component({
  selector: 'co-comment',
  templateUrl: './co-comment.component.html',
  styleUrls: ['./co-comment.component.scss']
})
export class CoCommentComponent {
  @Input({required: true}) comment: CoAbstractComment<CoCommentEntity>;
  textEditorConfig: TeBasicConfig = new TeBasicConfig();

  constructor() {
  }
}
