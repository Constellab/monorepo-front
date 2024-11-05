import { Component, EventEmitter, Input, Output } from '@angular/core';
import { c } from '@codemirror/legacy-modes/mode/clike';

@Component({
  selector: 'ha-comment-button',
  templateUrl: './ha-comment-button.component.html',
  styleUrls: ['./ha-comment-button.component.scss'],
})
export class HaCommentButtonComponent {
  @Input({ required: true }) commentsCount: number;

  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  click(): void {
    this.clicked.emit();
  }

  protected readonly c = c;
}
