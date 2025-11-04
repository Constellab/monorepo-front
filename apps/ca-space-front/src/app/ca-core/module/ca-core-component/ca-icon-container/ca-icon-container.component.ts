import { Component, computed, effect, HostBinding, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TdIconAutoColorPipe, TdIconBackgroundColorPipe } from '@monorepo/technical-doc';

@Component({
  selector: 'ca-icon-container',
  imports: [MatIcon, FlIconModule],
  templateUrl: './ca-icon-container.component.html',
  styleUrl: './ca-icon-container.component.scss',
})
export class CaIconContainerComponent {
  icon = input<string>();

  emoji = input<string>();

  backgroundColor = input<string>(null);

  @HostBinding('style.background') background: string;

  constructor() {
    effect(() => {
      if (this.backgroundColor()) {
        this.background = TdIconBackgroundColorPipe.getLinearGradient(this.backgroundColor());
      }
    });
  }

  iconColor = computed(() => {
    if (this.backgroundColor()) {
      return TdIconAutoColorPipe.getIconColorFromBackgroundColor(this.backgroundColor());
    }
    return null;
  });
}
