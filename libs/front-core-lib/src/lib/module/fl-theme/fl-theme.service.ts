import {Inject, Injectable, Optional, PLATFORM_ID, Renderer2, RendererFactory2} from '@angular/core';
import {FlPlatformService} from '../../service/fl-plateform.service';
import {FlLocalStorageService} from '../../service/fl-local-storage.service';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {clDefaultTheme, ClTheme, clThemeIsSupported} from '@monorepo/core-lib';
import {FlThemeDetail, flThemeDetailDark, flThemeDetailLight} from './model/fl-theme-detail.class';
import {flRootInjector} from '../../utils/fl-root-injector';
import {FlCookieService} from '../../service/fl-cookie.service';
import {REQUEST} from '@nguniversal/express-engine/tokens';

/**
 * Service to manage light and dark theme
 */
@Injectable({
  providedIn: 'root'
})
export class FlThemeService {

  private readonly themeKey: string = 'theme';

  private renderer: Renderer2;

  private request: any;

  constructor(private platformService: FlPlatformService,
              private cookieService: FlCookieService,
              @Inject(DOCUMENT) private document: Document,
              // eslint-disable-next-line @typescript-eslint/ban-types
              @Inject(PLATFORM_ID) private platformId: Object,
              @Optional() @Inject(REQUEST) request: any,
              rendererFactory: RendererFactory2) {
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
    }

    return theme;
  }

  private getCookieTheme(): ClTheme{
    if(isPlatformServer(this.platformId)) {
      return this.request?.cookies[this.themeKey] as ClTheme;
    }
    return this.cookieService.getStringCookie(this.themeKey) as ClTheme;
  }

  private setCookieTheme(theme: ClTheme): void {
    // set the cookie for 60 days
    const date = new Date(new Date().getTime() +  5184000000);
    // clear the millisecond to get closer to real expiration
    date.setMilliseconds(0);
    this.cookieService.setCookie(this.themeKey, theme, {
      expires: date,
      sameSite: 'Lax',
      secure: true,
      path: '/'
    });
  }

  public isDarkTheme(): boolean {
    return this.getCurrentTheme() === ClTheme.DARK_THEME;
  }

  /**
   * change the current app theme and save it in the local storage
   */
  public changeTheme(theme: ClTheme): void {
    if (this.checkTheme(theme) && (theme !== this.getCurrentTheme() || this.cookieService.getStringCookie(this.themeKey) != theme)) {
      this.storeTheme(theme);
      this.loadTheme(theme);
    }

    // set the class theme in the body element to be able to use it in the css
    this.renderer.addClass(this.document.body, 'g-' + theme);
  }

  // change the app theme by changing the css file
  private loadTheme(theme: ClTheme): void {
    const link = (this.document.getElementById('app-theme') as HTMLLinkElement);

    if (link) {
      this.renderer.setAttribute(link, 'href', `${theme}.css`);
    }
  }

  private storeTheme(theme: ClTheme): void {
    this.setCookieTheme(theme);
  }


  private checkTheme(theme: ClTheme | string): boolean {
    return clThemeIsSupported(theme);
  }

  // get the theme of the browser
  public getBrowserTheme(): ClTheme {
    if(isPlatformBrowser(this.platformId)){
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
}
