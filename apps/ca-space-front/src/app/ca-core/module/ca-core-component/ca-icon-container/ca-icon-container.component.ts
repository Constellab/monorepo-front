import { ChangeDetectionStrategy, Component, computed, effect, HostBinding, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TdIconAutoColorPipe, TdIconBackgroundColorPipe } from '@monorepo/technical-doc';

@Component({
  selector: 'ca-icon-container',
  imports: [MatIcon, FlIconModule],
  templateUrl: './ca-icon-container.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './ca-icon-container.component.scss',
})
export class CaIconContainerComponent {
  icon = input<string>();

  emoji = input<string>();

  backgroundColor = input<string | null | undefined>(null);

  @HostBinding('style.background') background: string;

  constructor() {
    effect(() => {
      const backgroundColor = this.backgroundColor();
      if (backgroundColor) {
        this.background = TdIconBackgroundColorPipe.getLinearGradient(backgroundColor);
      }
    });
  }

  iconColor = computed(() => {
    const backgroundColor = this.backgroundColor();
    if (backgroundColor) {
      return TdIconAutoColorPipe.getIconColorFromBackgroundColor(backgroundColor);
    }
    return null;
  });
}
