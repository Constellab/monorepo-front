import { Component, EventEmitter, Input, Output } from '@angular/core';
import { c } from '@codemirror/legacy-modes/mode/clike';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ha-comment-button',
  templateUrl: './ha-comment-button.component.html',
  styleUrls: ['./ha-comment-button.component.scss'],
  imports: [MatButton, MatIcon],
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
