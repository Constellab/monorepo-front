import { Component, Signal } from '@angular/core';
import { HaThemeState } from '../../../ha-core/ha-state/ha-theme.state';

@Component({
  selector: 'ha-fair-open-access-page',
  templateUrl: './ha-fair-open-access-page.component.html',
  styleUrl: './ha-fair-open-access-page.component.scss',
})
export class HaFairOpenAccessPageComponent {
  isDarkTheme: Signal<boolean> = this.themeState.isDarkTheme;

  constructor(private themeState: HaThemeState) {}
}
