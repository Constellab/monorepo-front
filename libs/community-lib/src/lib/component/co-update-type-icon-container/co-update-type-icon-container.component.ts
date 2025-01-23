import { Component, EventEmitter, HostBinding, input, Input, Output } from '@angular/core';
import { TdTypeStyle } from '@monorepo/technical-doc';

@Component({
  selector: 'co-update-type-icon-container',
  templateUrl: './co-update-type-icon-container.component.html',
  styleUrl: './co-update-type-icon-container.component.scss',
  standalone: false,
})
export class CoUpdateTypeIconContainerComponent {
  style = input.required<TdTypeStyle>();

  @Input({ required: true }) iconSize: number;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean = false;

  @Output() onClickEvent: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) this.onClickEvent.emit();
  }
}
