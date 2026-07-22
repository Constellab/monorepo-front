import { NgClass } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabService } from '../../../../service-api/ca-lab.service';

@Component({
  selector: 'ca-lab-login-button',
  templateUrl: './ca-lab-login-button.component.html',
  styleUrls: ['./ca-lab-login-button.component.scss'],
  imports: [MatTooltip, MatButtonModule, NgClass, MatIcon, FlLoaderModule, TranslatePipe],
})
export class CaLabLoginButtonComponent {
  private labService = inject(CaLabService);

  labId = input<string>();

  isRunning = input<boolean>(false);

  size = input<'small' | 'normal'>('normal');

  /** Translation key for the button label. */
  label = input<string>('go_to_lab');

  /** When true the button is a filled (primary) button instead of stroked. */
  filled = input<boolean>(false);

  isLoading = signal<boolean>(false);

  readonly buttonClass = computed(() => (this.size() === 'small' ? 'g-button-small' : ''));

  loginToLab(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.isLoading.set(true);
    this.labService.logUserToLab(this.labId()).subscribe({
      next: (result) => this.loginSuccess(result.url),
      error: () => this.isLoading.set(false),
    });
  }

  private loginSuccess(url: string): void {
    // redirect to the lab url
    window.location.href = url;
    this.isLoading.set(false);
  }

  // prevent ripple effect when used on card
  stopEventPropagation(event: Event): void {
    event.stopPropagation();
  }
}
