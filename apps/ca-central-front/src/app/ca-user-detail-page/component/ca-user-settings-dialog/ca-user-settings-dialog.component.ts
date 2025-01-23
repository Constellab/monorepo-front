import { Component, inject } from '@angular/core';
import { CaAuthService } from '../../../ca-login/service/ca-auth.service';
import { Router } from '@angular/router';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatDialogContent } from '@angular/material/dialog';
import { CaUserTwoFaToggleComponent } from '../ca-user-two-fa-toggle/ca-user-two-fa-toggle.component';
import { CaThemeSelectionComponent } from '../ca-theme-selection/ca-theme-selection.component';
import { CaLanguageSelectionComponent } from '../ca-language-selection/ca-language-selection.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Settings page
 */
@Component({
  selector: 'ca-user-settings-dialog',
  templateUrl: './ca-user-settings-dialog.component.html',
  styleUrls: ['./ca-user-settings-dialog.component.scss'],
  imports: [
    FlDialogModule,
    CdkScrollable,
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
