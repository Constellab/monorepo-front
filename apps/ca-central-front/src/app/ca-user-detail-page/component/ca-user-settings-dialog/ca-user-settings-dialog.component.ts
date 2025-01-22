import { Component, inject } from '@angular/core';
import { CaAuthService } from '../../../ca-login/service/ca-auth.service';
import { Router } from '@angular/router';
import { CaEnvironmentHelper } from '../../../ca-core/utils/ca-environment.helper';

/**
 * Settings page
 */
@Component({
  selector: 'ca-user-settings-dialog',
  templateUrl: './ca-user-settings-dialog.component.html',
  styleUrls: ['./ca-user-settings-dialog.component.scss'],
  standalone: false,
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
