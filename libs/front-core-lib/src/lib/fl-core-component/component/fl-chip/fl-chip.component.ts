import { ChangeDetectionStrategy,Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'fl-chip',
  templateUrl: './fl-chip.component.html',
  styleUrls: ['./fl-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlChipComponent {
  @HostBinding('class')
  @Input()
  size: 'normal' | 'small' | 'tiny' = 'normal';

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean = false;
}
