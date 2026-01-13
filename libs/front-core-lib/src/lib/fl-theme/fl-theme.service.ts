import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  DOCUMENT,
  inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
  REQUEST,
} from '@angular/core';
import { clDefaultTheme, ClTheme, clThemeIsSupported } from '@monorepo/core-lib';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';

import { FlThemeDetail, flThemeDetailDark, flThemeDetailLight } from './model/fl-theme-detail.class';

export interface FlThemeServiceConfig {
  // if not provided, default to ''
  cssThemeFileLocation: string;
}

export const FL_THEME_SERVICE_CONFIG = new InjectionToken<string>('FL_THEME_SERVICE_CONFIG');
/**
 * Service to manage light and dark theme
 */
@Injectable({
  providedIn: 'root',
})
export class FlThemeService {
  private cookieService = inject(FlCookieService);
  private document = inject<Document>(DOCUMENT);
  private platformId = inject<string>(PLATFORM_ID);
  private themeServiceConfig = inject<FlThemeServiceConfig>(FL_THEME_SERVICE_CONFIG, {
    optional: true,
  });

  private readonly themeKey: string = 'theme';

  private renderer: Renderer2;

  private request: any;

  constructor() {
    const request = inject(REQUEST, { optional: true });
    const rendererFactory = inject(RendererFactory2);

    this.renderer = rendererFactory.createRenderer(null, null);
    this.request = request;
  }

  public static getInstance(): FlThemeService {
    return flRootInjector.get(FlThemeService);
  }

  public init(): void {
    this.loadTheme(this.getCurrentTheme());
  }

  /**
   * Return the current theme or the default
   */
  public getCurrentTheme(): ClTheme {
    let theme = this.getCookieTheme();

    if (!this.checkTheme(theme)) {
      theme = this.getBrowserTheme();

      this.setCookieTheme(theme);
      this.loadTheme(theme);
    }

    return theme;
  }

  private getCookieTheme(): ClTheme {
    if (isPlatformServer(this.platformId) && this.request?.cookies) {
      return this.request?.cookies[this.themeKey] as ClTheme;
    }
    return this.cookieService.getStringCookie(this.themeKey) as ClTheme;
  }

  private setCookieTheme(theme: ClTheme): void {
    // set the cookie for 60 days
    const date = new Date(new Date().getTime() + 5184000000);
    // clear the millisecond to get closer to real expiration
    date.setMilliseconds(0);
    this.cookieService.setCookie(this.themeKey, theme, {
      expires: date,
      sameSite: 'Lax',
      secure: true,
      path: '/',
    });
  }

  public isDarkTheme(): boolean {
    return this.getCurrentTheme() === ClTheme.DARK_THEME;
  }

  /**
   * change the current app theme and save it in the local storage
   */
  public changeTheme(theme: ClTheme): void {
    if (
      this.checkTheme(theme) &&
      (this.cookieService.getStringCookie(this.themeKey) != theme || theme !== this.getCurrentTheme())
    ) {
      this.storeTheme(theme);
      this.loadTheme(theme);
    }
  }

  // change the app theme by changing the css file
  private loadTheme(theme: ClTheme): void {
    const link = this.document.getElementById('app-theme') as HTMLLinkElement;

    if (link) {
      let path: string = '';
      if (this.themeServiceConfig?.cssThemeFileLocation) {
        path = this.themeServiceConfig.cssThemeFileLocation + '/';
      }
      this.renderer.setAttribute(link, 'href', `${path}${theme}.css`);
    }

    // remove all class
    this.document.body.className = '';
    // set the class theme in the body element to be able to use it in the css
    this.renderer.addClass(this.document.body, 'g-' + theme);
  }

  private storeTheme(theme: ClTheme): void {
    this.setCookieTheme(theme);
  }

  private checkTheme(theme: ClTheme | string): boolean {
    return clThemeIsSupported(theme);
  }

  // get the theme of the browser
  public getBrowserTheme(): ClTheme {
    if (isPlatformBrowser(this.platformId)) {
      // dark-mode media query matched or not
      const matched: boolean = window?.matchMedia('(prefers-color-scheme: dark)')?.matches;

      if (matched == null) {
        return clDefaultTheme;
      }
      return matched ? ClTheme.DARK_THEME : ClTheme.LIGHT_THEME;
    }
    return ClTheme.LIGHT_THEME;
  }

  /**
   * Return the current theme detail
   */
  public getCurrentThemeDetail(): FlThemeDetail {
    const theme: ClTheme = this.getCurrentTheme();

    return theme === ClTheme.LIGHT_THEME ? flThemeDetailLight : flThemeDetailDark;
  }

  //////////////////////// OTHERS ////////////////////////
  public getConstellabLogo(): string {
    return this.isDarkTheme()
      ? 'assets/fl-logo/constellab-logo-text-white.svg'
      : 'assets/fl-logo/constellab-logo-text-black.svg';
  }

  public getPoweredByLogo(): string {
    return this.isDarkTheme()
      ? 'assets/fl-logo/powered-by-constellab-white.svg'
      : 'assets/fl-logo/powered-by-constellab-black.svg';
  }
}
