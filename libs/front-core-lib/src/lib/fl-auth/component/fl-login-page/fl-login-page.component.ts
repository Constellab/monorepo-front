import { Component, EventEmitter, inject,Input, OnInit, Output } from '@angular/core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';

@Component({
  selector: 'fl-login-page',
  templateUrl: './fl-login-page.component.html',
  styleUrls: ['./fl-login-page.component.scss'],
  standalone: false,
})
export class FlLoginPageComponent implements OnInit {
  private themeService = inject(FlThemeService);

  /**
   * Redirection route after the login is successful, do nothing if not provided
   */
  @Input() redirectionRoute?: string;

  @Input() lightThemeLogo: string = 'assets/fl-logo/constellab-logo-text-black.svg';

  @Input() darkThemeLogo: string = 'assets/fl-logo/constellab-logo-text-white.svg';

  @Output() loginSuccess: EventEmitter<void> = new EventEmitter<void>();

  logo: string;

  ngOnInit(): void {
    this.logo = this.themeService.isDarkTheme() ? this.darkThemeLogo : this.lightThemeLogo;
  }

  onLoginSuccess(): void {
    this.loginSuccess.emit();
  }
}
