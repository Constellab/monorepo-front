import { Component, inject, input } from '@angular/core';
import { FlClipboardService } from '@monorepo/front-core-lib/fl-snack-bar';

/**
 * Component to display a password with a show/hide button and a copy button
 */
@Component({
  selector: 'fl-password-hidden',
  standalone: false,
  templateUrl: './fl-password-hidden.component.html',
  styleUrl: './fl-password-hidden.component.scss',
})
export class FlPasswordHiddenComponent {
  password = input.required<string>();

  label = input.required<string>();

  showPassword = false;

  private clipboardService = inject(FlClipboardService);

  copyToClipboard(): void {
    this.clipboardService.copy(this.password(), 'flCoreComponent.copied_to_clipboard');
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
