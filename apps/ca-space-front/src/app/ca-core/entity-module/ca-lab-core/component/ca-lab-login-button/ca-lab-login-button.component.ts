import { Component, inject, Input } from '@angular/core';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { ClHelpService } from '@monorepo/core-lib';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-login-button',
  templateUrl: './ca-lab-login-button.component.html',
  styleUrls: ['./ca-lab-login-button.component.scss'],
  imports: [MatTooltip, MatButton, NgClass, MatIcon, FlLoaderModule, TranslatePipe],
})
export class CaLabLoginButtonComponent {
  private labService = inject(CaLabService);

  @Input() labId: string;

  @Input() isRunning: boolean = false;

  @Input() size: 'small' | 'normal' = 'normal';

  isLoading: boolean = false;

  loginToLab(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.isLoading = true;
    this.labService.logUserToLab(this.labId).subscribe({
      next: (result) => this.loginSuccess(result.url),
      error: () => (this.isLoading = false),
    });
  }

  private loginSuccess(url: string): void {
    // redirect to the lab url
    window.location.href = url;
    this.isLoading = false;
  }

  get buttonClass(): string {
    return this.size === 'small' ? 'g-button-small' : '';
  }

  // prevent ripple effect when used on card
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }
}
