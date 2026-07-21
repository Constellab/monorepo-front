import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ClTheme } from '@monorepo/core-lib';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { TranslatePipe } from '@ngx-translate/core';

import { CaAuthenticatedUserService } from '../../../ca-core/service-api/ca-authenticated-user.service';

/**
 * Component to select theme
 */
@Component({
  selector: 'ca-theme-selection',
  templateUrl: './ca-theme-selection.component.html',
  styleUrls: ['./ca-theme-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButton, TranslatePipe],
})
export class CaThemeSelectionComponent implements OnInit {
  private themeService = inject(FlThemeService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);

  private currentTheme: ClTheme;

  theme = ClTheme;

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  selectTheme(theme: ClTheme): void {
    if (this.currentTheme !== theme) {
      this.themeService.changeTheme(theme);
      this.authenticatedUserService.changeTheme(theme).subscribe();
      this.currentTheme = theme;
    }
  }
}
