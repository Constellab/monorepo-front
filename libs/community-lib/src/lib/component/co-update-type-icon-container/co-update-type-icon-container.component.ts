import { ChangeDetectionStrategy,Component, EventEmitter, HostBinding, Input, input, Output } from '@angular/core';
import { TdTypeStyle } from '@monorepo/technical-doc';

@Component({
  selector: 'co-update-type-icon-container',
  templateUrl: './co-update-type-icon-container.component.html',
  styleUrl: './co-update-type-icon-container.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoUpdateTypeIconContainerComponent {
  style = input.required<TdTypeStyle>();

  @Input({ required: true }) iconSize: number;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean = false;

  @Output() clickEvent: EventEmitter<void> = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) this.clickEvent.emit();
  }
}
