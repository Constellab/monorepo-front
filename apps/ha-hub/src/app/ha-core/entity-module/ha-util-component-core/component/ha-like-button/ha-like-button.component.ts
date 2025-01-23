import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { HaIsAuthenticatedDirective } from '../../../../ha-module/ha-core-directive/ha-is-authenticated/ha-is-authenticated.directive';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ha-like-button',
  templateUrl: './ha-like-button.component.html',
  styleUrls: ['./ha-like-button.component.scss'],
  imports: [MatButton, HaIsAuthenticatedDirective, MatIcon],
})
export class HaLikeButtonComponent {
  @Input({ required: true }) likesCount: number;
  @Input() isLiked: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  constructor() {}

  click(): void {
    this.clicked.emit();
  }
}
