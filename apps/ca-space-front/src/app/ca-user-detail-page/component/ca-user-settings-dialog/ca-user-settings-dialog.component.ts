import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { CaAuthService } from '../../../ca-login/service/ca-auth.service';
import { CaLanguageSelectionComponent } from '../ca-language-selection/ca-language-selection.component';
import { CaThemeSelectionComponent } from '../ca-theme-selection/ca-theme-selection.component';
import { CaUserTwoFaToggleComponent } from '../ca-user-two-fa-toggle/ca-user-two-fa-toggle.component';

/**
 * Settings page
 */
@Component({
  selector: 'ca-user-settings-dialog',
  templateUrl: './ca-user-settings-dialog.component.html',
  styleUrls: ['./ca-user-settings-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    CaUserTwoFaToggleComponent,
    CaThemeSelectionComponent,
    CaLanguageSelectionComponent,
    MatButton,
    MatIcon,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class CaUserSettingsDialogComponent {
  private authService = inject(CaAuthService);
  private router = inject(Router);

  logoutIsLoading: boolean = false;

  logout(): void {
    this.logoutIsLoading = true;
    this.authService.logout().subscribe({
      next: () => this.logoutSuccess(),
      error: () => (this.logoutIsLoading = false),
    });
  }

  private logoutSuccess(): void {
    if (window && CaEnvironmentHelper.isProduction()) {
      window.location.href = `https://${CaEnvironmentHelper.getFrontDomain()}`;
    } else {
      this.router.navigate(['/']);
    }
    this.logoutIsLoading = false;
  }
}
