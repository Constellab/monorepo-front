import {Component, Input, OnInit} from '@angular/core';
import {CoAbstractComment, CoCommentEntity} from '../../model/co-abstract-comment.class';
import {TeBasicConfig, TeRichText} from '@monorepo/text-editor';
import {FormControl} from '@ngneat/reactive-forms';

@Component({
  selector: 'co-comment',
  templateUrl: './co-comment.component.html',
  styleUrls: ['./co-comment.component.scss']
})
export class CoCommentComponent  implements OnInit{
  @Input({required: true}) comment: CoAbstractComment<CoCommentEntity>;
  textEditorConfig: TeBasicConfig = new TeBasicConfig();
  formControl: FormControl<TeRichText> = new FormControl<TeRichText>();

  constructor() {
  }

  ngOnInit(): void {
    this.formControl.setValue(this.comment.content);

    this.formControl.disable();
  }
}
