import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ha-like-button',
  templateUrl: './ha-like-button.component.html',
  styleUrls: ['./ha-like-button.component.scss']
})
export class HaLikeButtonComponent {

  @Input({required: true}) likesCount: number;
  @Input() isLiked: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  constructor() {
  }

  click(): void {
    this.clicked.emit();
  }
}
